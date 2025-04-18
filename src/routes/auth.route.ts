import express from "express";
import authController from "../controllers/auth.controller";

const authRouter = express.Router();
const endpoint = "/";

authRouter.post(`${endpoint}registration`, authController.register);
authRouter.post(`${endpoint}login`, authController.login);

export default authRouter;
