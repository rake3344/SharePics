import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  login,
  register,
  uploadProfileImage,
} from "../controllers/user.controller.js";
import __dirname from "../helpers/dirname.js";
import { userJWT } from "../middlewares/session.js";

const userRouter = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public"),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase());
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file);
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb("Error: Archivo debe ser una imagen valida");
  },
}).single("image");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/profile-image", upload, userJWT, uploadProfileImage);

export default userRouter;
