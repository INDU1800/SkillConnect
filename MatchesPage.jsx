import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowLeftRight, CheckCircle2, Info, Compass } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const MatchesPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ mutualMatches: [], otherMatches: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Propose exchange modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [message, setMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/matches');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to calculate matches. Please ensure your profile is up to date.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleOpenPropose = (match) => {
    setSelectedMatch(match);
    setSkillOffered(match.skillsICanTeachThem?.[0]?.skill || user?.skillsToTeach?.[0]?.name || '');
    setSkillRequested(match.skillsTheyCanTeachMe?.[0]?.skill || match.user?.skillsToTeach?.[0]?.name || '');
    setMessage(`Hi ${match.user.name.split(' ')[0]}! I noticed we have a reciprocal skill match. Let's arrange a skill swap!`);
    setIsModalOpen(true);
  };

  const handleSendExchange = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;

    try {
      setSendingRequest(true);
      await API.post('/requests', {
        receiverId: selectedMatch.user._id,
        skillOffered,
        skillRequested,
        message,
      });

      setIsModalOpen(false);
      setSuccessBanner(`Exchange request sent to ${selectedMatch.user.name}!`);
      setTimeout(() => setSuccessBanner(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send exchange request');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Algorithmic Matching Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Smart Skill Matches
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          We compare the skills you want to learn with what other students teach, and the skills you teach with what they want to learn.
        </p>
      </div>

      {/* Matching Algorithm Explanation Card */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-indigo-900">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">How the Matching Engine Works:</span>
          <p className="mt-0.5 text-indigo-700">
            A <strong>Mutual Match (Reciprocal)</strong> receives top priority because both students have skills the other desires. One-way matches show students who can teach your desired skills or who want to learn your skills.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Computing matches across student network..." />
      ) : data.total === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Matches Found"
          description="We couldn't find any direct skill matches for your current inventory. Try adding more skills you can teach or skills you want to learn!"
          actionLabel="Add More Skills"
          onAction={() => window.location.assign('/skills/add')}
        />
      ) : (
        <div className="space-y-10">
          {/* Mutual Matches Section */}
          {data.mutualMatches?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <h2 className="text-lg font-bold text-slate-900">
                  Strong Mutual Matches ({data.mutualMatches.length})
                </h2>
                <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                  High Reciprocity
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {data.mutualMatches.map((match) => (
                  <MatchCard
                    key={match.user._id}
                    match={match}
                    onProposeExchange={handleOpenPropose}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Matches Section */}
          {data.otherMatches?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <h2 className="text-lg font-bold text-slate-900">
                  One-Way Matches ({data.otherMatches.length})
                </h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                  Potential Connections
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {data.otherMatches.map((match) => (
                  <MatchCard
                    key={match.user._id}
                    match={match}
                    onProposeExchange={handleOpenPropose}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Propose Exchange Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Send Skill Exchange Request`}
      >
        <form onSubmit={handleSendExchange} className="space-y-4">
          <Input
            label="Skill You Will Teach"
            value={skillOffered}
            onChange={(e) => setSkillOffered(e.target.value)}
            placeholder="Skill you offer to teach"
            required
          />

          <Input
            label="Skill You Want to Learn"
            value={skillRequested}
            onChange={(e) => setSkillRequested(e.target.value)}
            placeholder="Skill you want them to teach you"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Proposal Note
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              placeholder="Suggest when and how you'd like to collaborate..."
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={sendingRequest}
            >
              Send Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MatchesPage;
