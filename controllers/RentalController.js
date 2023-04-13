import Rental from "../models/Rental.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { Response } from "./helpers/response.js";
import HistoryCard from "../models/HistoryCard.js";
import TypeMesin from "../models/TypeMesin.js";
import moment from "moment/moment.js";
import Penjualan from "../models/Penjualan.js";
import ExcelJS from "exceljs";

class RentalController {
  // create rental
  Rent = async (req, res) => {
    try {
      // config invoice, ada d readme penjelasan nya
      const year = new Date().getFullYear().toString();
      const month = (new Date().getMonth() + 1).toString();
      const date = new Date().getDate().toString();
      const status = req.body.status || "rent";
      const keterangan = req.body.keterangan || "init";
      // get product id from request body
      const { productId, customerId, startDate, endDate } = req.body;
      // find product in database
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      // find product in database
      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      const updateStatus = await Product.findByIdAndUpdate(
        { _id: productId },
        { status: status },
        { new: true }
      );
      // create rental with product and customer data
      const rental = await Rental.create({
        product: product._id,
        customer: customer._id,
        duration: req.body.duration,
        durationUnit: req.body.durationUnit,
        values: req.body.values,
        keterangan: keterangan,
        startDate: startDate,
        endDate: endDate,
      });

      // create HistoryCard
      const history = await HistoryCard.create({
        product: product._id,
        customer: customer._id,
        duration: req.body.duration,
        durationUnit: req.body.durationUnit,
        values: product.price * req.body.duration,
        startDate: startDate,
        endDate: endDate,
      });

      res.status(201).json({ data: { rental, customer, updateStatus } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // get all rentals
  getAllRentals = async (req, res) => {
    try {
      // search
      const search = req.query.search || "";

      // paginate
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const rentals = await HistoryCard.find()
        .populate("product")
        .populate("product.merek")
        .populate("customer")
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });

      console.log(rentals.product);

      const totalDocument = await Rental.countDocuments();

      const totalPages = Math.ceil(totalDocument / limit);

      const paginate = {
        currentPage: page,
        totalPages: totalPages,
        totalDocument: totalDocument,
      };

      res.json({ rentals, paginate });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // get by machine
  searchMesinRent = async (req, res) => {
    try {
      const sn = req.params.mesin;
      const findSn = await Product.findOne({ sn: sn }).populate("merek");

      if (!findSn) {
        return res.status(404).json({ message: "Mesin not found" });
      }

      console.log("id mesin", findSn._id);

      const historyCard = await HistoryCard.find({ product: findSn._id })
        // .populate("product")
        .populate("customer");

      res.json({ historyCard, findSn });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // get by machine
  searchCustRent = async (req, res) => {
    try {
      const custId = req.params.cust;
      console.log({ custId });
      const findcust = await Customer.findOne({ _id: custId });

      if (!findcust) {
        return res
          .status(401)
          .json({ message: "Tidak ada data rental pelanggan" });
      }

      const historyCard = await HistoryCard.find({
        customer: findcust,
      }).populate({
        path: "product",
      });

      if (!historyCard) {
        return res.status(401).json({ message: "produk kosong" });
      }

      res.json({ historyCard, findcust });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // get rental by id
  getRentalById = async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id)
        .populate("product")
        .populate("customer");

      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }
      let merekId = rental.product.merek;
      const merek = await TypeMesin.findById(merekId);
      res.json({ rental, merek });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  //   update rental
  UpdateRental = async (req, res) => {
    {
      try {
        const id = req.params.id;
        const {
          keterangan,
          qty,

          values,
          durationUnit,
          duration,
          newProduct,
          product,
          customer,
          startDate,
          endDate,
        } = req.body;
        const newStatus = req.body.newStatus || "rent";
        const status = req.body.status || "ready";
        //  get detail
        const detail = await Rental.findById(id);
        // update status mesin lama
        const productdata = await Product.findByIdAndUpdate(
          { _id: detail.product },
          { status: status },
          { new: true }
        );
        // update mesin
        const rental = await Rental.findByIdAndUpdate(
          { _id: id },
          {
            product: newProduct,
            customer: detail.customer || customer,
            duration: duration || detail.duration,
            keterangan: keterangan,
            values: values,
          },
          { new: true }
        );

        // update status new Product
        const produkBaru = await Product.findByIdAndUpdate(
          { _id: newProduct },
          {
            status: newStatus,
            duration: duration || detail.duration,
            keterangan: keterangan,
            values: values,
            startDate: startDate,
            endDate: endDate,
          }
        );
        // create history
        const history = await HistoryCard.create({
          product: newProduct,
          customer: detail.customer || customer,
          duration: duration || detail.duration,
          keterangan: keterangan,
          values: values,
          startDate: startDate,
          endDate: endDate,
        });

        // // create rental
        // const historyCard = await HistoryCard.create({
        //   product: product._id,
        //   customer: customer._id, // assuming user is authenticated and their id is stored in req.user
        //   duration: req.body.duration,
        //   durationUnit: req.body.durationUnit,
        //   values: req.body.values,
        //   status: req.body.status,
        // });
        res.status(201).json(
          Response.successResponse(
            {
              oldData: detail,
              changeOldstatus: productdata,
              nowRental: rental,
              history: history,
            },
            "Success update Rental"
          )
        );
      } catch (err) {
        res.status(500).json(Response.errorResponse(err.message));
      }
    }
  };
  //   tarik
  Tarik = async (req, res) => {
    {
      try {
        const id = req.params.id;

        const detail = await Rental.findById(id);
        // update status mesin lama
        const productdata = await Product.findByIdAndUpdate(
          { _id: detail.product },
          { status: "ready" },
          { new: true }
        );

        const cust = await Customer.findByIdAndUpdate(
          { _id: detail.customer },
          { keterangan: "off" },
          { new: true }
        );

        res.status(201).json(
          Response.successResponse(
            {
              oldData: detail,
              changeOldstatus: productdata,
              customer: cust,
            },
            "Success Tarik Rental"
          )
        );
      } catch (err) {
        res.status(500).json(Response.errorResponse(err.message));
      }
    }
  };

  //   delete rental
  deleteRental = async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);

      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }

      await rental.remove();

      res.json({ message: "Rental deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // filter bulan by date
  filterPerMonth = async (req, res) => {
    try {
      let data;
      const { start, end, type } = req.body;
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (type === "rental") {
        data = await Rental.find({
          createdAt: { $gte: startDate, $lte: endDate },
        })
          .populate("customer")
          .populate("product");
      } else if (type === "product") {
        data = await Product.find({
          createdAt: { $gte: startDate, $lte: endDate },
        });
      } else if (type === "selling") {
        data = await Penjualan.find({
          createdAt: { $gte: startDate, $lte: endDate },
        })
          .populate("customer")
          .populate("product");
      } else {
        data = null;
      }

      if (!data) {
        return res.status(404).json({ message: "data kosong" });
      }
      res.json({ data: data });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  };

  exportExel = async (req, res) => {
    const workbook = new ExcelJS.Workbook(); //creat new workbook
    const worksheet = workbook.addWorksheet("data Rentals");
    const path = "./public/data"; //path to download file

    const rentals = await Rental.find()
      .populate("customer")
      .populate("product");

    worksheet.columns = [
      { header: "No", key: "_id", width: 10 },
      { header: "values", key: "values", width: 10 },
      { header: "qty", key: "qty", width: 10 },
      { header: "customer", key: "customer", width: 10 },
      // {header: 'No', key : 'no' , width :10},
    ];
    let count = 1;
    rentals.forEach((item) => {
      let aziz = { ...item };

      aziz._id = count;
      aziz.customer = item.customer.company;
      worksheet.addRow(aziz);
      count++;
    });
    // line pertama styling to bold
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    try {
      const data = await workbook.xlsx.writeFile(`${path}/rental.xlsx`);
      return res.json({ status: "success", path: `${path}/rental.xlsx` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

export default new RentalController();
