import { NextFunction, Request, Response } from "express";
import WebResponse from "../helpers/response.helper";
import transactionService from "../services/transaction.service";

class TransactionController {
   async createTransaction(req: Request, res: Response, next: NextFunction) {
      try {
         const user = req.user;
         if (!user) {
            return WebResponse.error(res, 401, "Unauthorized");
         }
         const result = await transactionService.createTransaction(user.id, req.body);

         const returnedData = {
            invoice_number: result.id,
            service_code: result.service?.code,
            service_name: result.service?.name,
            transaction_type: result.type,
            total_amount: result.grand_total,
            created_on: result.created_at,
         }
         WebResponse.success(res, 201, "Transaksi berhasil", returnedData);
      } catch (err) {
         next(err);
      }
   }
}

export default new TransactionController();