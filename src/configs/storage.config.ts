import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req: any, file: any, cb: any) => {
   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
   } else {
      cb(null, false);
   }
}

const upload = multer({
   storage: storage,
   fileFilter: fileFilter,
   limits: {
      fileSize: 1024 * 1024 * 2, // 2MB
   },
});

export default upload;