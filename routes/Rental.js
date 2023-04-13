import express from "express";
import RentalController from "../controllers/RentalController.js";

const router = express.Router();

// create rent
router.post("/create", RentalController.Rent);
// findall
router.get("/", RentalController.getAllRentals);
// findone
router.get("/detail/:id", RentalController.getRentalById);
// update
router.patch("/update/:id", RentalController.UpdateRental);
// tarik mesin
router.patch("/tarik/:id", RentalController.Tarik);
// delete
router.delete("/delete/:id", RentalController.deleteRental);
// find by mesin
router.get("/mesin/:mesin", RentalController.searchMesinRent);
// find by customer
router.get("/track/:cust", RentalController.searchCustRent);
// filter Date
router.get("/filter-date", RentalController.filterPerMonth);

router.get("/report-excel", RentalController.exportExel);

export default router;
