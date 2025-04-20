import { CreateTransactionDto } from "../dto/transaction.dto";
import TransactionModel from "../models/transaction.model";
import ServiceModel from "../models/service.model";
import BalanceModel from "../models/balance.model";
import { validate } from "../validations/index.validation";
import transactionValidation from "../validations/transaction.validation";
import { ResponseError } from "../responses/error.response";
import pool from "../configs/db.config";

class TransactionService {
   async createTransaction(userId: number, request: CreateTransactionDto) {
      validate(transactionValidation.createValidation, request);
      const connection = await pool.getConnection();

      try {
         await connection.beginTransaction();

         const service = await ServiceModel.findByCode(request.service_code);
         if (!service) {
            throw new ResponseError("Service not found", 404, "Service not found");
         }

         const grandTotal = (request.total || 0) - (request.discount || 0) || service.tariff - (request.discount || 0);

         // check if the user has sufficient balance
         const balance = await BalanceModel.getBalance(userId);
         if (!balance) {
            throw new ResponseError("Balance not found", 404, "Balance not found");
         }

         if (Number(balance.balance) < Number(grandTotal)) {
            throw new ResponseError("Insufficient balance", 400, "Insufficient balance");
         }

         // update user balance
         const newBalance = Number(balance.balance) - Number(grandTotal);
         const updatedBalance = await BalanceModel.updateBalance(userId, newBalance, connection);
         if (!updatedBalance) {
            throw new ResponseError("Balance not found", 404, "Balance not found");
         }
         
         const transactionData = {
            user_id: userId,
            service_id: service.id || null,
            type: request.type || "PAYMENT",
            description: request.description || service.name,
            total: request.total || 0,
            discount: request.discount || 0,
            grand_total: grandTotal,
            status: request.status || "completed",
         }
         const transaction = await TransactionModel.createTransaction(transactionData, connection);
         if (!transaction) {
            throw new ResponseError("Transaction not created", 400, "Transaction not created");
         }

         await connection.commit();

         return transaction;
      } catch (error) {
         await connection.rollback();
         console.error("Error creating transaction:", error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async transactionHistory(userId: number, query: any) {
      try {
         const page = query.page ? Number(query.page) : 1;
         const limit = query.limit ? Number(query.limit) : 10;
         const additionalQuery = {
            limit: limit,
            offset: Number((page - 1) * limit),
            orderBy: query.orderBy ? query.orderBy : "created_at",
            order: query.order ? query.order : "DESC",
            search: query.search ? query.search : null,
         }

         const transactions = await TransactionModel.getTransactionByUserId(userId, additionalQuery);
         if (!transactions) {
            throw new ResponseError("Transaction not found", 404, "Transaction not found");
         }

         return {
            page: page,
            limit: limit,
            offset: Number((page - 1) * limit),
            records: transactions,
         };
      } catch (error) {
         console.error("Error fetching transaction history:", error);
         throw error;
      }
   }
}

export default new TransactionService();