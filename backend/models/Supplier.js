import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    city: {
        type: String,
        required: true,
    },
    type: {
      type: String,
      required: true,
    },
    contact: {
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
