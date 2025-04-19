import { Request, Response, NextFunction } from 'express';
import WebResponse from "../helpers/response.helper";
import bannerService from "../services/banner.service";

class BannerController {
   async getBanners(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await bannerService.getAllBanners(req.query);
         
         WebResponse.success(res, 200, "Sukses", result);
      } catch (err) {
         next(err);
      }
   }
}

export default new BannerController();