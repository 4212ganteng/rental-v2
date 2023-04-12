import cloudinary from "cloudinary";

import { unlinkSync } from "fs";

export const cloudinaryUploader = async (req, files) => {
  try {
    const uploadedUrls = [];
    let uploader;

    for (const file of files) {
      uploader = await cloudinary.v2.uploader.upload(file.path, {
        folder: "socialeg_assets",
        resource_type: "auto",
      });

      unlinkSync(file.path);

      uploadedUrls.push({
        src: uploader.secure_url,
        public_id: uploader.public_id,
      });
    }

    req.urls = uploadedUrls;

    return uploader;
  } catch (error) {
    console.log("cloudinry error: ", error);
  }
};

export const cloudinaryDestroyer = async (public_ids) => {
  for (let public_id of public_ids) {
    await cloudinary.v2.uploader.destroy(public_id);
  }
};
