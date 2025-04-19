import { ResultSetHeader } from 'mysql2';
import pool from '../configs/db.config';
import { ResponseError } from '../responses/error.response';

export interface UserAttributes {
   id: number;
   email: string;
   password: string;
   first_name: string;
   last_name?: string | null;
   profile_image?: string | null;
   created_at: Date;
   updated_at: Date;
}

class User {
   async createUser(userData: Omit<UserAttributes, 'id' | 'created_at' | 'updated_at'>): Promise<UserAttributes> {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
         const now = new Date();

         await connection.execute(
            `INSERT INTO users (email, password, first_name, last_name, profile_image, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userData.email, userData.password, userData.first_name, userData.last_name, 
             userData.profile_image || null, now, now]
         );

         const user = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [userData.email]
         );
         
         const users = user[0] as UserAttributes[];
         if (users.length === 0) {
            throw new ResponseError('User not found after creation', 404);
         }

         await connection.commit();

         return users[0];
      } catch (error) {
         await connection.rollback();
         console.error('Error creating user:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async updateUser(id: number, userData: Partial<UserAttributes>): Promise<UserAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         await connection.beginTransaction();
         const now = new Date();

        const updates: string[] = [];
        const values: any[] = [];
        
        Object.entries(userData).forEach(([key, value]) => {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        });
        
        updates.push('updated_at = ?');
        values.push(now);
        values.push(id);
        
        const [result] = await connection.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        ) as [ResultSetHeader, any];

         if (result.affectedRows === 0) {
            throw new ResponseError('User not found', 404);
         }

         const [rows] = await connection.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
         );
         
         const users = rows as UserAttributes[];
         if (users.length === 0) {
            throw new ResponseError('User not found after update', 404);
         }

         await connection.commit();

         return users[0];
      } catch (error) {
         await connection.rollback();
         console.error('Error updating user:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async findByEmail(email: string): Promise<UserAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
         );
         
         const users = rows as UserAttributes[];
         return users.length > 0 ? users[0] : null;
      } catch (error) {
         console.error('Error fetching user by email:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async findById(id: number): Promise<UserAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
         );
         
         const users = rows as UserAttributes[];
         return users.length > 0 ? users[0] : null;
      }  catch (error) {
         console.error('Error fetching user by ID:', error);
         throw error;
      } finally {
         connection.release();
      }
   }
}

export default new User();
