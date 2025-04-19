import express from 'express';
import bannerController from "../controllers/banner.controller";

const bannerRouter = express.Router();
const endpoint = "/banner";

bannerRouter.get(`${endpoint}`, bannerController.getBanners);

export default bannerRouter;