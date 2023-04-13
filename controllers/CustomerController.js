import Customer from "../models/Customer.js";
import Rental from "../models/Rental.js";
import { Response } from "./helpers/response.js";

class CustomerController {
  // create customer
  Create = async (req, res) => {
    try {
      const { layanan, idpl, joinDate, hp, address, email, name, company } =
        req.body;

      const spk = req.files.spk[0].filename;
      console.log("spk nihhhhhh");

      const keterangan = req.body.keterangan || "aktif";
      const status = req.body.status || "reguler";

      const customer = await Customer.create({
        ...req.body,
        keterangan: keterangan,
        status: status,
        spk: spk,
        idpl: `Cust` + (Math.floor(Math.random() * 1000000) + 1000000),
      });

      res
        .status(201)
        .json(
          Response.successResponse({ customer }, "Success create customer")
        );
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  multipleUploads = async (req, res) => {
    try {
      const { layanan, idpl, joinDate, hp, address, email, name, company } =
        req.body;

      const spk = req.files.spk ? req.files.spk[0].filename : null;
      console.log("spk", spk);
      const kwitansi = req.files.kwitansi
        ? req.files.kwitansi[0].filename
        : null;
      const sj = req.files.sj ? req.files.sj[0].filename : null;
      const oha = req.files.oha ? req.files.oha[0].filename : null;
      console.log("sj", sj);

      const keterangan = req.body.keterangan || "aktif";
      const status = req.body.status || "reguler";

      const customer = await Customer.create({
        ...req.body,
        keterangan: keterangan,
        status: status,
        spk: spk,
        kwitansi: kwitansi,
        sj: sj,
        oha,
        oha,
        idpl: `Cust` + (Math.floor(Math.random() * 1000000) + 1000000),
      });

      res
        .status(201)
        .json(
          Response.successResponse({ customer }, "Success create customer")
        );
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
      console.log(err);
    }
  };

  // find all customer
  Find = async (req, res) => {
    try {
      const customer = await Customer.find().sort({ createdAt: -1 });
      res
        .status(201)
        .json(
          Response.successResponse({ customer }, "Success get all customer")
        );
    } catch (error) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  // detail customer
  Detail = async (req, res) => {
    try {
      const id = req.params.id;
      const customer = await Customer.findOne({ _id: id });
      // get rental data with customer ID
      const rental = await Rental.find({ customer: id }).populate("product");
      res
        .status(201)
        .json(
          Response.successResponse(
            { customer, rental },
            "Success create customer"
          )
        );
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  // update customer

  Update = async (req, res) => {
    try {
      const customerId = req.params.id;
      const customer = await Customer.findOne({ _id: customerId });
      if (!customer) {
        return res
          .status(404)
          .json(Response.errorResponse("Customer not found"));
      }

      const {
        layanan,
        idpl,
        joinDate,
        hp,
        address,
        email,
        name,
        company,
        status,
        keterangan,
      } = req.body;

      const updatedData = {
        layanan,
        idpl,
        joinDate,
        hp,
        address,
        email,
        name,
        company,
        status: status || customer.status,
        keterangan: keterangan || customer.keterangan,
        spk: req.files.spk ? req.files.spk[0].filename : customer.spk,
        kwitansi: req.files.kwitansi
          ? req.files.kwitansi[0].filename
          : customer.kwitansi,
        sj: req.files.sj ? req.files.sj[0].filename : customer.sj,
        oha: req.files.oha ? req.files.oha[0].filename : customer.oha,
      };

      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: customerId },
        updatedData,
        { new: true }
      );

      res
        .status(200)
        .json(
          Response.successResponse(
            { customer: updatedCustomer },
            "Success update customer"
          )
        );
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
      console.log(err);
    }
  };

  // delete customer
  Remove = async (req, res) => {
    try {
      const id = req.params.id;
      const findcust = await Customer.findOne({ _id: id });
      if (!findcust) {
        return res
          .status(404)
          .json(Response.errorResponse("Customer tidak di temukan"));
      } else {
        const customer = await Customer.findByIdAndDelete({ _id: id });
        return res
          .status(201)
          .json(
            Response.successResponse({ customer }, "Success Delete customer")
          );
      }
    } catch (error) {
      return res.status(404).json(Response.errorResponse(error.message));
    }
  };

  // find filter
  findFilter = async (req, res) => {
    try {
      const key = req.params.key;
      const total = await Customer.countDocuments({ status: key });
      if (total <= 0) {
        return res.status(404).json({ message: "data kosong" });
      }
      const findcust = await Customer.find({ status: key });

      return res.status(200).json({ data: { total, findcust } });
    } catch (error) {
      return res.status(404).json(Response.errorResponse(error.message));
    }
  };
  findKeterangan = async (req, res) => {
    try {
      const key = req.params.key;
      const total = await Customer.countDocuments({ keterangan: key });
      if (total <= 0) {
        return res.status(404).json({ message: "data kosong" });
      }
      const findcust = await Customer.find({ keterangan: key });

      return res.status(200).json({ data: { total, findcust } });
    } catch (error) {
      return res.status(404).json(Response.errorResponse(error.message));
    }
  };
}

export default new CustomerController();
