import express from "express";
import transactionController from "../controllers/transaction.controller";
import authMiddleware from "../middlewares/auth.middleware";

const transactionRouter = express.Router();
const endpoint = "/transaction";

transactionRouter.post(`${endpoint}`, authMiddleware, transactionController.createTransaction);
transactionRouter.get(`${endpoint}/history`, authMiddleware, transactionController.transactionHistory);

export default transactionRouter;