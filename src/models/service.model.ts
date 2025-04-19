import { ResultSetHeader } from 'mysql2';
import pool from '../configs/db.config';
import { ResponseError } from '../responses/error.response';

export interface ServiceAttributes {
   id: number;
   code: string;
   name: string;
   icon: string;
   tariff: number;
   created_at: Date;
   updated_at: Date;
}

class Service {
   async createService(serviceData: Omit<ServiceAttributes, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceAttributes> {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
         const now = new Date();

         const [result] = await connection.execute(
            `INSERT INTO services (code, name, icon, tariff, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [serviceData.code, serviceData.name, serviceData.icon, serviceData.tariff, now, now]
         ) as [ResultSetHeader, any];

         const [rows] = await connection.execute(
            'SELECT * FROM services WHERE id = ?',
            [result.insertId]
         );
         
         const services = rows as ServiceAttributes[];
         if (services.length === 0) {
            throw new ResponseError('Service not found after creation', 404);
         }

         await connection.commit();

         return services[0];
      } catch (error) {
         await connection.rollback();
         console.error('Error creating service:', error);
         throw new ResponseError('Error creating service', 500, error);
      } finally {
         connection.release();
      }
   }

   async updateService(id: number, serviceData: Partial<ServiceAttributes>): Promise<ServiceAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         await connection.beginTransaction();
         const now = new Date();

         const updates: string[] = [];
         const values: any[] = [];
         
         Object.entries(serviceData).forEach(([key, value]) => {
             if (value !== undefined) {
                 updates.push(`${key} = ?`);
                 values.push(value);
             }
         });
         
         updates.push('updated_at = ?');
         values.push(now);
         values.push(id);
         
         const [result] = await connection.execute(
             `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
             values
         ) as [ResultSetHeader, any];

         if (result.affectedRows === 0) {
            throw new ResponseError('Service not found', 404);
         }

         const [rows] = await connection.execute(
            'SELECT * FROM services WHERE id = ?',
            [id]
         );
         
         const services = rows as ServiceAttributes[];
         if (services.length === 0) {
            throw new ResponseError('Service not found after update', 404);
         }

         await connection.commit();

         return services[0];
      } catch (error) {
         await connection.rollback();
         console.error('Error updating service:', error);
         throw new ResponseError('Error updating service', 500, error);
      } finally {
         connection.release();
      }
   }

   async findById(id: number): Promise<ServiceAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute(
            'SELECT * FROM services WHERE id = ?',
            [id]
         );
         
         const services = rows as ServiceAttributes[];
         return services.length > 0 ? services[0] : null;
      } finally {
         connection.release();
      }
   }

   async findByCode(code: string): Promise<ServiceAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute(
            'SELECT * FROM services WHERE code = ?',
            [code]
         );
         
         const services = rows as ServiceAttributes[];
         return services.length > 0 ? services[0] : null;
      } finally {
         connection.release();
      }
   }

   async findAll(): Promise<ServiceAttributes[]> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute('SELECT * FROM services ORDER BY name ASC');
         return rows as ServiceAttributes[];
      } finally {
         connection.release();
      }
   }

   async deleteService(id: number): Promise<boolean> {
      const connection = await pool.getConnection();
      
      try {
         await connection.beginTransaction();
         
         const [result] = await connection.execute(
            'DELETE FROM services WHERE id = ?',
            [id]
         ) as [ResultSetHeader, any];
         
         if (result.affectedRows === 0) {
            throw new ResponseError('Service not found', 404);
         }
         
         await connection.commit();
         return true;
      } catch (error) {
         await connection.rollback();
         console.error('Error deleting service:', error);
         throw new ResponseError('Error deleting service', 500, error);
      } finally {
         connection.release();
      }
   }
}

export default new Service();