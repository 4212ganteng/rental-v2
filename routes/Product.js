import express from "express";
import Productcontroller from "../controllers/ProductController.js";

const router = express.Router();

// create
router.post("/create", Productcontroller.Create);
// Find products
router.get("/", Productcontroller.Find);
// detail
router.get("/detail/:id", Productcontroller.Detail);
// update
router.patch("/update/:id", Productcontroller.Update);
// delete
router.delete("/remove/:id", Productcontroller.Remove);
// filter status ready
router.get("/status", Productcontroller.Findfilter);
// type Mesin
router.post("/type-mesin", Productcontroller.createTypeMesin);
router.get("/type-mesin", Productcontroller.findTypemwsin);
router.get("/mesin/:type", Productcontroller.findmesinBytype);
// by sattatus
router.get("/status/:key", Productcontroller.findKeterangan);

export default router;
