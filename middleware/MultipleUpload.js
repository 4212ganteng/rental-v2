import multer from "multer";

export const multiuploads = (folders) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = folders[file.fieldname];
      if (folder) {
        cb(null, `public/data/${folder}`);
      } else {
        cb(new Error("Invalid field name"));
      }
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() + "-" + file.originalname.toLowerCase().replace(/\s/g, "")
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    cb(null, true);
  };

  const sizeInMb = 30;
  const maxSize = sizeInMb * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    { name: "spk", maxCount: 5 },
    { name: "kwitansi", maxCount: 2 },
    { name: "oha", maxCount: 2 },
    { name: "sj", maxCount: 2 },
    { name: "foto", maxCount: 2 },
  ]);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: `Max file sized ${sizeInMb}MB`,
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
