import { Response } from "../controllers/helpers/response.js";

import { upload } from "@packages/multer.js";
import { cloudinaryUploader } from "@packages/cloudinary.js";

export const uploadFiles = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json(Response.errorResponse(err.message));
    }

    await cloudinaryUploader(req, req.files);

    next();
  });
};
