import express from 'express';
import serviceController from "../controllers/service.controller";
import authMiddleware from "../middlewares/auth.middleware";

const serviceRouter = express.Router();
const endpoint = "/service";

serviceRouter.get(`${endpoint}`, authMiddleware, serviceController.getServices);

export default serviceRouter;