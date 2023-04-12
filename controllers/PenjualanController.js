import Customer from "../models/Customer.js";
import Penjualan from "../models/Penjualan.js";
import Product from "../models/Product.js";

class PenjualanController {
  Create = async (req, res) => {
    try {
      // config invoice, ada d readme penjelasan nya
      const year = new Date().getFullYear().toString();
      const month = (new Date().getMonth() + 1).toString();
      const date = new Date().getDate().toString();
      const status = req.body.status || "sell";
      const keterangan = req.body.keterangan || "init";
      // get product id from request body
      const { productId, customerId, values, dateSell, qty } = req.body;
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
      const penjualan = await Penjualan.create({
        product: product._id,
        customer: customer._id,
        ...req.body,
      });

      res.status(201).json({ data: { penjualan, customer, updateStatus } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  findsell = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;

      const endIndex = page * limit;

      const product = await Product.find({ status: "sell" })
        .skip(startIndex)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

      if (!product) {
        return res.status(404).json({ message: "data kosong" });
      }

      const total = await Product.countDocuments();
      const totalpages = Math.ceil(total / limit);
      const paginate = {
        total,
        totalpages,
        page,
      };

      return res.json({ data: { product, paginate } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: err.message });
    }
  };
}
export default new PenjualanController();
