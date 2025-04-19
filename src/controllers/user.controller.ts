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

const updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = req.user;
      if (!user) {
         return WebResponse.error(res, 401, "Unauthorized");
      }

      const imageFile = req.file?.originalname;
      if (!imageFile) {
         return WebResponse.error(res, 400, "Image file is required");
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const result = await userService.updateProfileImage(user.id, req.file, baseUrl);
      
      WebResponse.success(res, 200, "Update Profile Image berhasil", result);
   } catch (err) {
      next(err);
   }
}

export default {
   userProfile,
   updateProfile,
   updateProfileImage,
}