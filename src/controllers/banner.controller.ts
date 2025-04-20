import { Request, Response, NextFunction } from 'express';
import WebResponse from "../helpers/response.helper";
import bannerService from "../services/banner.service";

class BannerController {
   async getBanners(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await bannerService.getAllBanners(req.query);
         
         const returnedData = result.map((item) => {
            return {
               // id: item.id,
               banner_name: item.name,
               banner_image: item.image_url,
               description: item.description,
            }
         });
         WebResponse.success(res, 200, "Sukses", returnedData);
      } catch (err) {
         next(err);
      }
   }
}

export default new BannerController();