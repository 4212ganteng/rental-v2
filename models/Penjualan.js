import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const PenjualanSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "Customer",
    },

    product: {
      type: ObjectId,
      ref: "Product",
    },

    values: {
      type: Number,
      default: 0,
    },

    qty: {
      type: Number,
      default: 1,
    },
    invoice: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: "",
    },
    keterangan: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Penjualan = mongoose.model("Penjualan", PenjualanSchema);
export default Penjualan;
