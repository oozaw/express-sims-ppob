import { ResultSetHeader } from 'mysql2';
import pool from '../configs/db.config';
import { ResponseError } from '../responses/error.response';

export interface BannerAttributes {
   id: number;
   name: string;
   description: string;
   image_url: string;
   created_at: Date;
   updated_at: Date;
}

class Banner {
   async createBanner(bannerData: Omit<BannerAttributes, 'id' | 'created_at' | 'updated_at'>, existingConnection?: any): Promise<BannerAttributes> {
      const connection = existingConnection || await pool.getConnection();
      if (!existingConnection) await connection.beginTransaction();
      
      try {
         const now = new Date();

         const [result] = await connection.execute(
            `INSERT INTO banners (name, description, image_url, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?)`,
            [bannerData.name, bannerData.description, bannerData.image_url, now, now]
         ) as [ResultSetHeader, any];

         const [rows] = await connection.execute(
            'SELECT * FROM banners WHERE id = ?',
            [result.insertId]
         );
         
         const banners = rows as BannerAttributes[];
         if (banners.length === 0) {
            throw new ResponseError('Banner not found after creation', 404);
         }

         if (!existingConnection) await connection.commit();

         return banners[0];
      } catch (error) {
         if (!existingConnection) await connection.rollback();
         console.error('Error creating banner:', error);
         throw error;
      } finally {
         if (!existingConnection) connection.release();
      }
   }

   async updateBanner(id: number, bannerData: Partial<BannerAttributes>, existingConnection?: any): Promise<BannerAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         if (!existingConnection) await connection.beginTransaction();
         const now = new Date();

         const updates: string[] = [];
         const values: any[] = [];
         
         Object.entries(bannerData).forEach(([key, value]) => {
             if (value !== undefined) {
                 updates.push(`${key} = ?`);
                 values.push(value);
             }
         });
         
         updates.push('updated_at = ?');
         values.push(now);
         values.push(id);
         
         const [result] = await connection.execute(
             `UPDATE banners SET ${updates.join(', ')} WHERE id = ?`,
             values
         ) as [ResultSetHeader, any];

         if (result.affectedRows === 0) {
            throw new ResponseError('Banner not found', 404);
         }

         const [rows] = await connection.execute(
            'SELECT * FROM banners WHERE id = ?',
            [id]
         );
         
         const banners = rows as BannerAttributes[];
         if (banners.length === 0) {
            throw new ResponseError('Banner not found after update', 404);
         }

         if (!existingConnection) await connection.commit();

         return banners[0];
      } catch (error) {
         if (!existingConnection) await connection.rollback();
         console.error('Error updating banner:', error);
         throw error;
      } finally {
         if (!existingConnection) connection.release();
      }
   }

   async findById(id: number): Promise<BannerAttributes | null> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute(
            'SELECT * FROM banners WHERE id = ?',
            [id]
         );
         
         const banners = rows as BannerAttributes[];
         return banners.length > 0 ? banners[0] : null;
      } catch (error) {
         console.error('Error fetching banner:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async findAll(): Promise<BannerAttributes[]> {
      const connection = await pool.getConnection();
      
      try {
         const [rows] = await connection.execute('SELECT * FROM banners ORDER BY created_at DESC');
         return rows as BannerAttributes[];
      } catch (error) {
         console.error('Error fetching all banners:', error);
         throw error;
      } finally {
         connection.release();
      }
   }

   async deleteBanner(id: number, existingConnection?: any): Promise<boolean> {
      const connection = await pool.getConnection();
      
      try {
         if (!existingConnection) await connection.beginTransaction();
         
         const [result] = await connection.execute(
            'DELETE FROM banners WHERE id = ?',
            [id]
         ) as [ResultSetHeader, any];
         
         if (result.affectedRows === 0) {
            throw new ResponseError('Banner not found', 404);
         }
         
         if (!existingConnection) await connection.commit();
         return true;
      } catch (error) {
         if (!existingConnection) await connection.rollback();
         console.error('Error deleting banner:', error);
         throw error;
      } finally {
         if (!existingConnection) connection.release();
      }
   }
}

export default new Banner();