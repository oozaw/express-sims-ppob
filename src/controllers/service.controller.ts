import { Request, Response, NextFunction } from "express";
import WebResponse from "../helpers/response.helper";
import serviceService from "../services/service.service";

class ServiceController {
   async getServices(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await serviceService.getAllServices(req.query);
         WebResponse.success(res, 200, "Sukses", result);
      } catch (err) {
         next(err);
      }
   }
}

export default new ServiceController();