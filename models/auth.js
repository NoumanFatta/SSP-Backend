import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  uniqueId: { type: String },
  timeStamp: { type: Date, default: Date.now() },
});

const Auth = mongoose.model("auth", AuthSchema);

// Auth.createIndexes();
export default Auth;
