import mongoose from "mongoose";

const tempStudentSchema = new mongoose.Schema({
  roleNumber: { type: String },
  fullName: { type: String },
  fatherName: { type: String },
  city: { type: String },
  gender: { type: String },
  email: { type: String },
  phone: { type: String },
  cnic: { type: String },
  dob: { type: Date },
  address: { type: String },
  course: { type: mongoose.Types.ObjectId, ref: "course" },
});

const StudentsFile = mongoose.model("studentsRecord", tempStudentSchema);

export default StudentsFile;
