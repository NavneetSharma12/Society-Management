import mongoose from "mongoose";

const Message = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, require:true },
}, { timestamps: true });

export  default  mongoose.model("Message", Message);
