import mongoose from "mongoose";

const packageBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    service: {
        type: String,
        required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
        type: String,
        required: true,
    },
    vehicle: {
        type: String,
         required: true,
    },
    note: {
        type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", packageBookingSchema);
