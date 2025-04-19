import { ResultSetHeader } from 'mysql2';
import pool from '../configs/db.config';
import { ResponseError } from '../responses/error.response';

export interface BalanceAttributes {
   id: number;
   user_id: number;
   balance: number;
   created_at: Date;
   updated_at: Date;
}

class Balance {
   async createBalance(userId: number, initialBalance: number): Promise<BalanceAttributes> {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
         const now = new Date();

         const [result] = await connection.execute(
            `INSERT INTO user_balances (user_id, balance, created_at, updated_at) 
             VALUES (?, ?, ?, ?)`,
            [userId, initialBalance, now, now]
         ) as [ResultSetHeader, any];

         const [rows] = await connection.execute(
            'SELECT * FROM user_balances WHERE id = ?',
            [result.insertId]
         );
         const balances = rows as BalanceAttributes[];

         if (balances.length === 0) {
            throw new ResponseError('Balance not found after creation', 404);
         }

         await connection.commit();

         return balances[0];
      } catch (error) {
         await connection.rollback();
         console.error('Error creating balance:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async getBalance(userId: number): Promise<BalanceAttributes | null> {
      const connection = await pool.getConnection();
      try {
         const [rows] = await connection.execute(
            'SELECT * FROM user_balances WHERE user_id = ?',
            [userId]
         );
         const balances = rows as BalanceAttributes[];

         return balances.length > 0 ? balances[0] : null;
      } catch (error) {
         console.error('Error fetching balance:', error);
         throw new ResponseError('Error fetching balance', 500, error);
      } finally {
         connection.release();
      }
   }

   async updateBalance(userId: number, newBalance: number): Promise<BalanceAttributes | null> {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
         const now = new Date();

         const [result] = await connection.execute(
            `UPDATE user_balances SET balance = ?, updated_at = ? WHERE user_id = ?`,
            [newBalance, now, userId]
         ) as [ResultSetHeader, any];

         if (result.affectedRows === 0) {
            throw new ResponseError('Balance not found', 404);
         }

         const [rows] = await connection.execute(
            'SELECT * FROM user_balances WHERE user_id = ?',
            [userId]
         );
         const balances = rows as BalanceAttributes[];
         if (balances.length === 0) {
            throw new ResponseError('Balance not found after update', 404);
         }

         await connection.commit();

         return balances.length > 0 ? balances[0] : null;
      } catch (error) {
         await connection.rollback();
         console.error('Error updating balance:', error);
         throw error;
      } finally {
         connection.release();
      }
   }
}

export default new Balance();