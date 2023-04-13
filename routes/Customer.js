import express from "express";
import CustomerController from "../controllers/CustomerController.js";
import { uploads } from "../middleware/uploadmulter.js";
import { multiuploads } from "../middleware/MultipleUpload.js";
// import { verifyToken } from "../middleware/Auth.js";

const router = express.Router();
// create
router.post("/create", uploads("spk", "spk"), CustomerController.Create);
// multiple uploads
router.post(
  "/multi",
  multiuploads({
    spk: "spk",
    kwitansi: "kwitansi",
    oha: "oha",
    sj: "sj",
    foto: "foto",
  }),
  CustomerController.multipleUploads
);
// find
router.get("/", CustomerController.Find);
// update
router.patch("/update/:id", CustomerController.Update);
// delete
router.delete("/remove/:id", CustomerController.Remove);
// detial
router.get("/detail/:id", CustomerController.Detail);
router.get("/status/:key", CustomerController.findFilter);
router.get("/keterangan/:key", CustomerController.findKeterangan);

export default router;
