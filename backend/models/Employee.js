import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
      },
      nic: {
        type: String,
        unique: true,
      },
      passport:{
        type:String,
      },
      name: {
        type: String,
      },
    type: {
        type: String,
    },
    contact: {
        type: Number,
    },
    address: {
        type: String,
    },
    age: {
        type: Number,
    },
    salary: {
        type: Number
    },
    attendance: {
      type: String
    },
    leaveDate: {
      type: String
    },
    reason:{
      type: String,
    },
    status:{
      type:String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Employee", vehicleSchema);
