import mongoose from 'mongoose';

const ServiceHelpRequestSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ServiceHelpRequest', ServiceHelpRequestSchema);
