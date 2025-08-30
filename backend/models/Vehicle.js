import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    type: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    front: {
        type: String,
        required: true,
    },
    rear: {
        type: String,
        required: true,
    },
    serviceDate: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    manufacture: {
        type: Number,
        required: true,
    },
    milage: {
        type: Number,
        required: true,
    },
    fuel: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
