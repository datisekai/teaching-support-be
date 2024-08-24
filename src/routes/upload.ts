import { Router } from "express";
import multer from "multer";
import UploadController from "../controllers/UploadController";
import { checkJwt } from "../middlewares/checkJwt";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  [checkJwt, upload.single("image")],
  UploadController.uploadImage
);

export default router;
