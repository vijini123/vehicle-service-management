import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    type: {
      type: String,
    },
    contact: {
      type: String,
    },
    carType: {
      type: String,
    },
    serviceDate: {
      type: Date,
    },
    message: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);