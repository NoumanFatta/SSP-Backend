import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "auth" },
  course: { type: mongoose.Types.ObjectId, ref: "course" },
});

const Form = mongoose.model("form", FormSchema);

// Form.createIndexes();
export default Form;
