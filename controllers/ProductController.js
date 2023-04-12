import Product from "../models/Product.js";
import TypeMesin from "../models/TypeMesin.js";
import { Response } from "./helpers/response.js";

class ProductController {
  // create a new product
  Create = async (req, res) => {
    try {
      const {
        merek,
        sn,
        jenis,
        price,
        date,
        status,
        supplier,
        startCounter,
        overhole,
      } = req.body;

      const cekSN = await Product.findOne({ sn });
      if (cekSN) {
        return res.status(400).json({ message: "SN sudah ada" });
      }
      const brand = await TypeMesin.findById(merek);
      if (!brand) {
        return res.status(400).json({ message: "Merek tidak ditemukan" });
      }

      const product = await Product.create({
        ...req.body,
        merekName: brand.typeMesin,
      });

      res
        .status(201)
        .json(Response.successResponse({ product }, "Success Create Product"));
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  //   find all products
  Find = async (req, res) => {
    try {
      const product = await Product.find()
        .populate("merek")
        .sort({ createdAt: -1 });
      res
        .status(201)
        .json(
          Response.successResponse({ product }, "Success Find all Product")
        );
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  Findfilter = async (req, res) => {
    try {
      const product = await Product.find({ status: "ready" });

      if (!product) {
        return res.status(404).json({ message: "stok gudang kosong" });
      }

      return res.json({ message: "success", data: product });
    } catch (error) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  //   detail Product

  Detail = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findOne({ _id: id }).populate("merek");
      res
        .status(201)
        .json(
          Response.successResponse({ product }, "Success Find all Product")
        );
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  // update a product
  Update = async (req, res) => {
    try {
      const id = req.params.id;
      const {
        merek,
        sn,
        jenis,
        price,
        date,
        status,
        supplier,
        startCounter,
        overhole,
      } = req.body;
      const product = await Product.findByIdAndUpdate(
        { _id: id },
        {
          ...req.body,
        },
        { new: true }
      );

      res
        .status(201)
        .json(Response.successResponse({ product }, "Success update Product"));
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  // delete a product
  Remove = async (req, res) => {
    try {
      const id = req.params.id;
      // ada gak id nya
      const find = await Product.findById({ _id: id });
      if (!find) {
        return res
          .status(404)
          .json(Response.errorResponse("product tidak di temukan"));
      } else {
        const product = await Product.findByIdAndDelete(id);
        res
          .status(201)
          .json(
            Response.successResponse({ product }, "Success Delete Product")
          );
      }
    } catch (err) {
      res.status(500).json(Response.errorResponse(err.message));
    }
  };

  // type mesin

  createTypeMesin = async (req, res) => {
    try {
      const { typeMesin } = req.body;
      const cekName = await TypeMesin.findOne({ typeMesin });
      if (cekName) {
        return res
          .status(500)
          .json(Response.errorResponse(`${typeMesin} sudah ada`));
      }

      const data = await TypeMesin.create({ typeMesin });
      res.json({ message: "success", data: data });
    } catch (error) {
      res.status(500).json(Response.errorResponse(error.message));
    }
  };

  findTypemwsin = async (req, res) => {
    try {
      const data = await TypeMesin.find();
      res.json({ message: "success", data: data });
    } catch (error) {
      res.status(500).json(Response.errorResponse(error.message));
    }
  };

  // find mesin by type
  findmesinBytype = async (req, res) => {
    try {
      const typeId = req.params.type;
      console.log("typeid", typeId);
      const typeMesin = await Product.find({
        merek: typeId,
        status: "ready",
      });
      if (!typeMesin) {
        return res.status(404).json({ message: "Sn tidak ada" });
      } else if (typeMesin.length <= 0) {
        return res.status(404).json({ message: "produk ini belu punya sn" });
      }
      res.json({ status: 200, data: typeMesin });
    } catch (error) {
      res.status(500).json(Response.errorResponse(error.message));
    }
  };

  findKeterangan = async (req, res) => {
    try {
      const key = req.params.key;
      const total = await Product.countDocuments({ status: key });
      if (total <= 0) {
        return res.status(404).json({ message: "data kosong" });
      }
      const findcust = await Product.find({ status: key });

      return res.status(200).json({ data: { total, findcust } });
    } catch (error) {
      return res.status(404).json(Response.errorResponse(error.message));
    }
  };
}
export default new ProductController();
