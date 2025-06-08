import mongoose from "mongoose";

const userSchemas = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  gender: { type: String, enum: ["male", "Female"] },
  followers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  following: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  posts:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
  bookmarks:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}]
},{timestamps:true});

export default mongoose.model("User", userSchemas);
