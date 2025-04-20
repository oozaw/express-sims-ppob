import { ResultSetHeader } from "mysql2";
import { ResponseError } from "../responses/error.response";
import pool from "../configs/db.config";
import { ServiceAttributes } from "./service.model";

export interface TransactionAttributes {
   id: number;
   user_id: number;
   service_id?: number | null;
   type: string;
   description: string;
   status: string;
   total: number;
   discount: number;
   grand_total: number;
   created_at: Date;
   updated_at: Date;

   service?: ServiceAttributes | null;
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
         let id = `INV${day}${month}${year}-${transactionCountStr}`;
         
         const [rows] = await connection.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [id]
         );
         const transactions = rows as TransactionAttributes[];
         if (transactions.length > 0) {
            id = `INV${day}${month}${year}-${String(transactionCount + 1).padStart(4, '0')}`;
         }

         return id;
      } catch (error) {
         console.error('Error generating transaction ID:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async createTransaction(transactionData: Omit<TransactionAttributes, 'id' | 'created_at' | 'updated_at'>, existingConnection?: any): Promise<TransactionAttributes> {
      const connection = existingConnection || await pool.getConnection();
      if (!existingConnection) await connection.beginTransaction();

      try {
         const now = new Date();
         const transactionId = await this.generateId();

         const [result] = await connection.execute(
            `INSERT INTO transactions (id, user_id, service_id, type, description, status, total, discount, grand_total, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [transactionId, transactionData.user_id, transactionData.service_id, transactionData.type, transactionData.description, transactionData.status, transactionData.total, transactionData.discount, transactionData.grand_total, now, now]
         ) as [ResultSetHeader, any];

         const [rows] = await connection.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [transactionId]
         );
         const transactions = rows as TransactionAttributes[];

         if (transactions.length === 0) {
            throw new ResponseError('Transaction not found after creation', 404);
         }

         // get the service if not null
         if (transactionData.service_id) {
            const [serviceRows] = await connection.execute(
               'SELECT * FROM services WHERE id = ?',
               [transactionData.service_id]
            );
            const services = serviceRows as any[];
            if (services.length === 0) {
               throw new ResponseError('Service not found', 404);
            }
            transactions[0].service = services[0];
         }

         if (!existingConnection)await connection.commit();

         return transactions[0];
      } catch (error) {
         if (!existingConnection) await connection.rollback();
         console.error('Error creating transaction:', error);
         throw error;
      } finally {
         if (!existingConnection) connection.release();
      }
   }

   async getTransactionByUserId(userId: number, query?: any): Promise<TransactionAttributes[]> {
      const allowedColumns = ['created_at', 'grand_total'];
      const allowedOrders = ['ASC', 'DESC'];
      const connection = await pool.getConnection();

      try {
         if (!allowedColumns.includes(query?.orderBy)) query.orderBy = 'created_at';
         if (!allowedOrders.includes(query?.order)) query.order = 'DESC';

         const [rows] = await connection.execute(
            `SELECT * FROM transactions WHERE user_id = ? ORDER BY ${query.orderBy} ${query.order} LIMIT ? OFFSET ?`,
            [userId, query?.limit || 10, query?.offset || 0]
         );
         const transactions = rows as TransactionAttributes[];

         return transactions;
      } catch (error) {
         console.error('Error fetching transactions:', error);
         throw error;
      } finally {
         connection.release();
      }
   }
}

export default new Transaction();