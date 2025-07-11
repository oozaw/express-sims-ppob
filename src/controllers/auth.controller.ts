import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import WebResponse from '../helpers/response.helper';

class AuthController {
   async register(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await authService.register(req.body);
         
         WebResponse.success(res, 201, "Registrasi berhasil silahkan login");
      } catch (err) {
         next(err);
      }
   }

   async login(req: Request, res: Response, next: NextFunction) {
      try {
         const result = await authService.login(req.body);

         WebResponse.success(res, 200, "Login Sukses", {
            token: result.accessToken,
         });
      } catch (err) {
         next(err);
      }
   }
}

export default new AuthController();
