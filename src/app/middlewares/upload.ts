import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
});
export default upload;
