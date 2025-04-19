import balanceService from "../services/balance.service";
import { Request, Response, NextFunction } from "express";
import WebResponse from "../helpers/response.helper";

class BalanceController {
   async getBalance(req: Request, res: Response, next: NextFunction) {
      try {
         const user = req.user;
         if (!user) {
            return WebResponse.error(res, 401, "Unauthorized");
         }
         const result = await balanceService.getBalance(user.id);

         WebResponse.success(res, 200, "Get Balance Berhasil", { balance: result?.balance });
      } catch (err) {
         next(err);
      }
   }

   async topUpBalance(req: Request, res: Response, next: NextFunction) {
      try {
         const user = req.user;
         if (!user) {
            return WebResponse.error(res, 401, "Unauthorized");
         }
         const result = await balanceService.topUpBalance(user.id, req.body);

         WebResponse.success(res, 200, "Top Up Balance Berhasil", { balance: result?.balance });
      } catch (err) {
         next(err);
      }
   }
}

export default new BalanceController();