import mongoose from "mongoose";

const OptModel = new mongoose.Schema({
  email: { type: String,require:true,unique:true},
  detail:{
    otp: { type: String, required: true }, 
    expiry: { type: Date, required: true }
  }
}, { timestamps: true });

export  default  mongoose.model("UserOtp", OptModel);