import multer from "multer";

import {
  multerStorage as storage,
  multerFileFilter as fileFilter,
} from "@utils/constants.js";

export const upload = multer({ storage, fileFilter }).array("files", 10);
