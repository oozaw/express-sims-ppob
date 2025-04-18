import { Request, Response, NextFunction } from 'express';
import WebResponse from '../helpers/response.helper';
import userService from '../services/user.service';

const userProfile = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = req.user;
      if (!user) {
         return WebResponse.error(res, 401, "Unauthorized");
      }
      const result = await userService.profile(user.id);
      
      WebResponse.success(res, 200, "Sukses", result);
   } catch (err) {
      next(err);
   }
}

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = req.user;
      if (!user) {
         return WebResponse.error(res, 401, "Unauthorized");
      }

      const result = await userService.updateProfile(user.id, req.body);
      
      WebResponse.success(res, 200, "Sukses", result);
   } catch (err) {
      next(err);
   }
}

export default {
   userProfile,
   updateProfile
}