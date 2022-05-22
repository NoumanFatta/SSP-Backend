import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  uniqueId: { type: String },
  roleNo: { type: String, index: true, unique: true, sparse: true },
  cnic: { type: String, index: true, unique: true, sparse: true },
  appliedCourses: [{ type: mongoose.Types.ObjectId, ref: "course" }],
  enrolledCourses: [{ type: mongoose.Types.ObjectId, ref: "course" }],
  timeStamp: { type: Date, default: Date.now() },
});

const Auth = mongoose.model("auth", AuthSchema);

// Auth.createIndexes();
export default Auth;
