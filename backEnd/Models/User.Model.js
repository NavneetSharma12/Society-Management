import mongoose from "mongoose";

const userSchemas = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['super_admin', 'admin', 'resident', 'security'], required: true },
  permissions: [{ type: String }],
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
},{timestamps:true});

export default mongoose.model("User", userSchemas);
