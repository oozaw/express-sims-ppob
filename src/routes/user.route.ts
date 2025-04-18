import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRouter = express.Router();
const endpoint = "/";

userRouter.get(`${endpoint}profile`, authMiddleware, userController.userProfile);
userRouter.put(`${endpoint}profile`, authMiddleware, userController.updateProfile);

export default userRouter;
