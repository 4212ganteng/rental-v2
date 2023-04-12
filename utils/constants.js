import multer from "multer";

export const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

export const multerFileFilter = (req, file, cb) => {
  const mimeType = ["image/png", "image/jpeg", "video/mp4"];

  if (!file) {
    cb(null, true);
  }

  if (!mimeType.includes(file.mimetype)) {
    cb(new Error(`${file.mimetype} file is not supported!`));
    return;
  }

  cb(null, true);
};
