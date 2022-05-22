import mongoose from "mongoose";

const tempStudentSchema = new mongoose.Schema({
  roleNo: { type: String },
});

const StudentsFile = mongoose.model("studentsRecord", tempStudentSchema);

export default StudentsFile;
