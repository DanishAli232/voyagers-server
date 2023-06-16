import multer from "multer";
import path from "path";

// Image uploader Controller for POST api/posts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname);
  },
});

const upload = multer({
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
  storage: storage,
  limits: {
    fileSize: "1000000000000",
    fieldSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
});

export default upload;
