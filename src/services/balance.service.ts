import pool from "../configs/db.config";
import { TopUpDto } from "../dto/top-up.dto";
import BalanceModel, { BalanceAttributes } from "../models/balance.model";
import transactionModel from "../models/transaction.model";
import { ResponseError } from "../responses/error.response";
import balanceValidation from "../validations/balance.validation";
import { validate } from "../validations/index.validation";

class BalanceService {
   async getBalance(userId: number): Promise<Partial<BalanceAttributes> | null> {
      try {
         const balance = await BalanceModel.getBalance(userId);
         if (!balance) {
            throw new ResponseError("Balance not found", 404, "Balance not found");
         }

         return balance;
      } catch (error) {
         console.error("Error fetching balance:", error);
         throw error;
      }
   }

   async topUpBalance(userId: number, request: TopUpDto): Promise<Partial<BalanceAttributes> | null> {
      validate(balanceValidation.topUpValidation, request);
      const connection = await pool.getConnection();

      try {
         await connection.beginTransaction();

         const balance = await BalanceModel.getBalance(userId);
         if (!balance) {
            throw new ResponseError("Balance not found", 404, "Balance not found");
         }

         const newBalance = Number(balance.balance) + Number(request.top_up_amount);
         const updatedBalance = await BalanceModel.updateBalance(userId, newBalance, connection);
         if (!updatedBalance) {
            throw new ResponseError("Balance not found", 404, "Balance not found");
         }

         // create transaction record
         const transactionData = {
            service_id: request.service_id || null,
            user_id: userId,
            type: "TOPUP",
            description: request.description || "Top Up balance",
            total: request.top_up_amount,
            discount: request.discount || 0,
            grand_total: request.top_up_amount - (request.discount || 0),
            status: "completed",
         }
         await transactionModel.createTransaction(transactionData, connection);

         await connection.commit();

         return updatedBalance;
      } catch (error) {
         await connection.rollback();
         console.error("Error topping up balance:", error);
         throw error;
      } finally {
         connection.release();
      }
   }
}
export default new BalanceService();