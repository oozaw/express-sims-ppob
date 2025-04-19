import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import upload from "../configs/storage.config";

const userRouter = express.Router();
const endpoint = "/";

userRouter.get(`${endpoint}profile`, authMiddleware, userController.userProfile);
userRouter.put(`${endpoint}profile/update`, authMiddleware, userController.updateProfile);
userRouter.put(`${endpoint}profile/image`, authMiddleware, upload.single('file'), userController.updateProfileImage);

export default userRouter;
