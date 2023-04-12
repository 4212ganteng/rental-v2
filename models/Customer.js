import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    name: {
      type: String,
      require: true,
      min: 5,
      max: 50,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    address: {
      type: String,
      default: "",
      min: 5,
    },
    hp: {
      type: String,
      default: "",
    },

    joinDate: {
      type: Date,
      default: "",
    },

    idpl: {
      type: String,
      default: "",
    },

    layanan: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["reguler", "vip", "vvip"],
    },

    keterangan: {
      type: String,
      enum: ["aktif", "off", "cuti"],
    },
    spk: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
