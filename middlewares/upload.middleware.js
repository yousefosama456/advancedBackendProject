const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  if (!file || !file.originalname) {
    return cb(new Error("No file uploaded"), false);
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.png', '.jpg', '.jpeg'];

  if (!allowed.includes(ext)) {
    return cb(new Error("Only image files are allowed"), false);
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const MB = 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MB * 2 }  // FIXED
});

module.exports = { upload };
