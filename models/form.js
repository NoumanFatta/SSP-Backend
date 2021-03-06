import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
  roleNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  cnic: { type: String, unique: true, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  course: { type: mongoose.Types.ObjectId, ref: "course" },
});

FormSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error(`${Object.keys(error.keyPattern)[0]} already exists`));
  } else {
    next(error);
  }
});

const Form = mongoose.model("form", FormSchema);

// Form.createIndexes();
export default Form;
