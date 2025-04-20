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

   async transactionHistory(req: Request, res: Response, next: NextFunction) {
      try {
         const user = req.user;
         if (!user) {
            return WebResponse.error(res, 401, "Unauthorized");
         }

         const result = await transactionService.transactionHistory(user.id, req.query);

         const returnedData = {
            ...result,
            records: result.records.map((item) => {
               return {
                  invoice_number: item.id,
                  transaction_type: item.type,
                  description: item.description,
                  total_amount: item.grand_total,
                  created_on: item.created_at,
               };
            })
         }
         WebResponse.success(res, 200, "Get History Berhasil", returnedData);
      } catch (err) {
         next(err);
      }
   }
}

export default new TransactionController();