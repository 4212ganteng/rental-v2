import multer from "multer";

export const uploads = (folder, file) => {
  // cek ada g file nya
  if (!file || file === null) {
    console.log("FILE NOT UPLOADED....");
    return (req, res, next) => {
      return next();
    };
  }
  const storage = multer.diskStorage({
    // mengarah tujuan file

    destination: (req, file, cb) => {
      //console.log("storage", file);
      console.log("storage", folder);
      cb(
        null,
        `public/data/${
          typeof folder == "string" ? folder : folder[file.fieldname]
        }`
      );
    },
    filename: (req, file, cb) => {
      console.log("file", file);
      cb(
        null,
        Date.now() + "-" + file.originalname.toLowerCase().replace(/\s/g, "")
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    // if (folder === "spk") {
    //   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|PDF)$/)) {
    //     req.fileValidationError = {
    //       message: "Only image files",
    //     };
    //     return cb(new Error("Only image files"), false);
    //   }
    // } else if (folder === "images") {
    //   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    //     req.fileValidationError = {
    //       message: "Only image files",
    //     };
    //     return cb(new Error("Only image files"), false);
    //   }
    // }
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
  }).fields(
    typeof file == "string"
      ? [
          {
            name: file,
            maxCount: 5,
          },
        ]
      : typeof file == "object"
      ? [
          ...file.map((d) => ({
            name: d,
            maxCount: 2,
          })),
        ]
      : []
  );

  return (req, res, next) => {
    upload(req, res, (err) => {
      console.log("filer", req.files);
      // if (req.fileValidationError) {
      //     return res.status(400).send(req.fileValidationError);
      // }

      // if (!req.files && !err) {
      //     return res.status(400).send({
      //         message: "Please select files to upload",
      //     });
      // }

      if (err) {
        console.log(err);
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
