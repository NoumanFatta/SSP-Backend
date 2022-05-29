import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  roleNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  cnic: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  appliedCourse: { type: mongoose.Types.ObjectId, ref: "course" },
});

studentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error(`${Object.keys(error.keyPattern)[0]} already exists`));
  } else {
    next(error);
  }
});
const Students = mongoose.model("student", studentSchema);
export default Students;
