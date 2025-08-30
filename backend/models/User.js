import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      sparse: true,
    },
    lastname: {
      type: String,
      sparse: true,
    },
    contactN: {
      type: Number,
      sparse: true,
    },
    city: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      sparse: true,
    },

    role: {
      type: String,
      default: "user",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
