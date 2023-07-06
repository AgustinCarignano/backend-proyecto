import multer from "multer";
import { __dirname } from "../utils/path.utils.js";

const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    const fileType = file.fieldname.split("-")[0];
    cb(null, `${__dirname}/public/files/${fileType}s`);
  },
  filename: function (req, file, cb) {
    const { id } = req.user;
    const type = file.mimetype.split("/")[1];
    const fileName = file.fieldname.split("-")[1];
    cb(null, `${fileName}-${id}.${type}`);
  },
});

export const upload = multer({ storage });
