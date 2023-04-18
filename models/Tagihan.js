import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const TagihanSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "Customer",
    },
    rental: {
      type: ObjectId,
      ref: "Rental",
    },

    product: {
      type: ObjectId,
      ref: "Product",
    },
    pemakaian: {
      type: Number,
      default: 0,
    },

    tagihan: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Tagihan = mongoose.model("Tagihan", TagihanSchema);
export default Tagihan;
