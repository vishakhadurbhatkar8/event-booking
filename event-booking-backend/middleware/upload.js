import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folders exist
const createFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";
    if (file.fieldname === "banner") folder += "banners/";
    if (file.fieldname === "idProof") folder += "idproofs/";
    createFolder(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
