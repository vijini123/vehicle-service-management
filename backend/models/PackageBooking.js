import mongoose from "mongoose";

const packageBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    title: {
        type: String,
      },
    description: {
        type: String,
      },
    price: {
          type: String,
      },
    cardNumber:{
      type:Number,
    },
    expire:{
      type:String,
    },
    cvv:{
      type:Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Package-Booking", packageBookingSchema);
