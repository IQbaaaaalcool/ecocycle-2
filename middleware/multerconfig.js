import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // Ganti dengan direktori penyimpanan yang sesuai
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + Date.now() + ext;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

export default upload;