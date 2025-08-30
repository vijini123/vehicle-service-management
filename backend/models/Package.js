import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
