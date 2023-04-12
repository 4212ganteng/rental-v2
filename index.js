import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/Auth.js";
import customerRoutes from "./routes/Customer.js";
import productRoutes from "./routes/Product.js";
import rentalRoutes from "./routes/Rental.js";
import penjualanRoutes from "./routes/Penjualan.js";

import cloudinary from "cloudinary";
import multer from "multer";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// multer
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/data");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toString() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// // midleware multer
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("spk"));

/* ROUTES WITH FILES*/
// app.post("/auth/register", upload.single("picture"), register);

/*  ROUTES*/
app.use("/auth", authRoutes);
app.use("/erp/customer", customerRoutes);
app.use("/erp/machine", productRoutes);
app.use("/erp/rental", rentalRoutes);
app.use("/erp/penjualan", penjualanRoutes);
// app.use("/users", userRoutes);
// app.use(postsRoutes);
// app.use(commentsRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error}`));
