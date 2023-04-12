import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const ProductSchema = new mongoose.Schema(
  {
    merek: {
      type: ObjectId,
      ref: "TypeMesin",
    },
    sn: {
      type: String,
      required: true,
      unique: true,
      min: 2,
      max: 50,
    },
    merekName: {
      type: String,
      default: "",
    },
    jenis: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      enum: ["rent", "ready", "sell"],
      default: "ready",
    },
    supplier: {
      type: String,
      default: "",
    },
    startCounter: {
      type: String,
      default: "",
    },

    overhole: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
