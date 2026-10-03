import mongoose from 'mongoose';

const exchangeRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillOffered: {
    type: String,
    required: [true, 'Skill offered is required'],
    trim: true,
  },
  skillRequested: {
    type: String,
    required: [true, 'Skill requested is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  message: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);
export default ExchangeRequest;
