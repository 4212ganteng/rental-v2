import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const RentalSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "Customer",
    },

    product: {
      type: ObjectId,
      ref: "Product",
    },
    newProduct: {
      type: ObjectId,
      ref: "Product",
    },
    duration: {
      type: Number,
      default: 1,
    },
    durationUnit: {
      type: String,
      default: "Tahun",
    },
    values: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["rent", "ready", "sell"],
      default: "rent",
    },
    newStatus: {
      type: String,
      enum: ["rent", "ready", "sell"],
      // default: "rent",
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
const Rental = mongoose.model("Rental", RentalSchema);
export default Rental;
