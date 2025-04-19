import balanceController from "../controllers/balance.controller";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware";

const balanceRouter = express.Router();
const endpoint = "/";

balanceRouter.get(`${endpoint}balance`, authMiddleware, balanceController.getBalance);
balanceRouter.post(`${endpoint}topup`, authMiddleware, balanceController.topUpBalance);

export default balanceRouter;