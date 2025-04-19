import { ResultSetHeader } from "mysql2";
import { ResponseError } from "../responses/error.response";
import pool from "../configs/db.config";

export interface TransactionAttributes {
   id: number;
   user_id: number;
   type: string;
   description: string;
   status: string;
   total: number;
   discount: number;
   grand_total: number;
   created_at: Date;
   updated_at: Date;
}

class Transaction {
   async generateId(): Promise<string> {
      const connection = await pool.getConnection();

      try {
         const currentDate = new Date();
         const day = String(currentDate.getDate()).padStart(2, '0');
         const month = String(currentDate.getMonth() + 1).padStart(2, '0');
         const year = currentDate.getFullYear();
         
         const [lastTransaction] = await connection.execute(
            'SELECT id FROM transactions where MONTH(created_at) = ? AND YEAR(created_at) = ? ORDER BY created_at DESC LIMIT 1',
            [month, year]
         ) as [any[], any];
         const lastTransactionId = lastTransaction[0]?.id || 0;
         const lastTransIdParts = lastTransactionId.toString().split('-')[1];
         const transactionCount = lastTransIdParts ? parseInt(lastTransIdParts) + 1 : 1;
         const transactionCountStr = String(transactionCount).padStart(4, '0');
         
         return `INV${day}${month}${year}-${transactionCountStr}`;
      } catch (error) {
         console.error('Error generating transaction ID:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async createTransaction(transactionData: Omit<TransactionAttributes, 'id' | 'created_at' | 'updated_at'>): Promise<TransactionAttributes> {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
         const now = new Date();
         const transactionId = await this.generateId();

         const [result] = await connection.execute(
            `INSERT INTO transactions (id, user_id, type, description, status, total, discount, grand_total, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [transactionId, transactionData.user_id, transactionData.type, transactionData.description, transactionData.status, transactionData.total, transactionData.discount, transactionData.grand_total, now, now]
         ) as [ResultSetHeader, any];

         const [rows] = await connection.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [result.insertId]
         );
         const transactions = rows as TransactionAttributes[];

         if (transactions.length === 0) {
            throw new ResponseError('Transaction not found after creation', 404);
         }

         await connection.commit();

         return transactions[0];
      } catch (error) {
         await connection.rollback();
         console.error('Error creating transaction:', error);
         throw error;
      } finally {
         connection.release();
      }
   }
}

export default new Transaction();