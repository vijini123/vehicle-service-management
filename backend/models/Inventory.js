import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    quantity: {
        type: String,
        required: true,
    },
    price: {
      type: String,
      required: true,
    },
    brand: {
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
