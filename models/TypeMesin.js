import mongoose from "mongoose";
const TypeMesinSchema = new mongoose.Schema({
  typeMesin: {
    type: String,
    default: "",
  },
});

const TypeMesin = mongoose.model("TypeMesin", TypeMesinSchema);
export default TypeMesin;
