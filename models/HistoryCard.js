import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const HistoryCardSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "Customer",
    },

    product: {
      type: ObjectId,
      ref: "Product",
    },
    duration: {
      type: Number,
      default: 1,
    },
    durationUnit: {
      type: String,
      default: "Bulan",
    },
    values: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "unpaid",
    },
    qty: {
      type: Number,
      default: 1,
    },
    invoice: {
      type: String,
      default: "",
    },

    keterangan: {
      type: String,
      enum: ["init", "upgrade", "downgrade", "tukar"],
      default: "init",
    },
    startDate: {
      type: Date,
      default: "",
    },
    endDate: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true }
);

const HistoryCard = mongoose.model("HistoryCard", HistoryCardSchema);
export default HistoryCard;
