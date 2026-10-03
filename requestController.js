import ExchangeRequest from '../models/ExchangeRequest.js';
import User from '../models/User.js';

// @desc    Send a skill exchange request
// @route   POST /api/requests
// @access  Private
export const sendRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillRequested, message } = req.body;

    if (!receiverId || !skillOffered || !skillRequested) {
      return res.status(400).json({
        message: 'Receiver, skill offered, and skill requested are required',
      });
    }

    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({
        message: 'You cannot send an exchange request to yourself',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver student not found' });
    }

    // Check if an existing pending request is already open
    const existing = await ExchangeRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered: skillOffered.trim(),
      skillRequested: skillRequested.trim(),
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({
        message: 'A pending request with these skills already exists for this student',
      });
    }

    const request = await ExchangeRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered: skillOffered.trim(),
      skillRequested: skillRequested.trim(),
      message: message ? message.trim() : '',
      status: 'pending',
    });

    const populated = await ExchangeRequest.findById(request._id)
      .populate('sender', 'name email college course avatar')
      .populate('receiver', 'name email college course avatar');

    return res.status(201).json({
      message: 'Exchange request sent successfully',
      request: populated,
    });
  } catch (error) {
    console.error('sendRequest error:', error);
    return res.status(500).json({ message: 'Error sending request', error: error.message });
  }
};

// @desc    Get all requests sent by current user
// @route   GET /api/requests/sent
// @access  Private
export const getSentRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ sender: req.user._id })
      .populate('receiver', 'name email college course year avatar')
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    console.error('getSentRequests error:', error);
    return res.status(500).json({ message: 'Error fetching sent requests', error: error.message });
  }
};

// @desc    Get all requests received by current user
// @route   GET /api/requests/received
// @access  Private
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ receiver: req.user._id })
      .populate('sender', 'name email college course year avatar')
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    console.error('getReceivedRequests error:', error);
    return res.status(500).json({ message: 'Error fetching received requests', error: error.message });
  }
};

// @desc    Update request status (accept, reject, cancel, complete)
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    const request = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email college course year avatar')
      .populate('receiver', 'name email college course year avatar');

    if (!request) {
      return res.status(404).json({ message: 'Exchange request not found' });
    }

    const isSender = request.sender._id.toString() === req.user._id.toString();
    const isReceiver = request.receiver._id.toString() === req.user._id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'Not authorized to modify this request' });
    }

    // Role-based status checks
    if ((status === 'accepted' || status === 'rejected') && !isReceiver) {
      return res.status(403).json({ message: 'Only the receiver can accept or reject this request' });
    }

    if (status === 'cancelled' && !isSender) {
      return res.status(403).json({ message: 'Only the sender can cancel this request' });
    }

    request.status = status;
    await request.save();

    return res.json({
      message: `Request status updated to ${status}`,
      request,
    });
  } catch (error) {
    console.error('updateRequestStatus error:', error);
    return res.status(500).json({ message: 'Error updating request status', error: error.message });
  }
};

// @desc    Get dashboard metrics for logged in user
// @route   GET /api/requests/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const [sentRequests, receivedRequests] = await Promise.all([
      ExchangeRequest.find({ sender: userId }).populate('receiver', 'name email college course avatar').sort({ createdAt: -1 }),
      ExchangeRequest.find({ receiver: userId }).populate('sender', 'name email college course avatar').sort({ createdAt: -1 }),
    ]);

    const pendingReceived = receivedRequests.filter(r => r.status === 'pending');
    const pendingSent = sentRequests.filter(r => r.status === 'pending');
    const activeExchanges = [...sentRequests, ...receivedRequests].filter(r => r.status === 'accepted');

    return res.json({
      stats: {
        skillsTeachingCount: (user.skillsToTeach || []).length,
        skillsLearningCount: (user.skillsToLearn || []).length,
        pendingRequestsCount: pendingReceived.length + pendingSent.length,
        activeExchangesCount: activeExchanges.length,
      },
      skillsToTeach: user.skillsToTeach || [],
      skillsToLearn: user.skillsToLearn || [],
      recentReceived: receivedRequests.slice(0, 5),
      recentSent: sentRequests.slice(0, 5),
      activeExchanges: activeExchanges.slice(0, 5),
    });
  } catch (error) {
    console.error('getDashboardData error:', error);
    return res.status(500).json({ message: 'Error loading dashboard data', error: error.message });
  }
};
