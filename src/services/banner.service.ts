import BannerModel, { BannerAttributes } from "../models/banner.model";

class BannerService {
   async getAllBanners(query: any): Promise<BannerAttributes[]> {
      try {
         const banners = await BannerModel.findAll();
         return banners;
      } catch (error) {
         console.error("Error fetching all banners:", error);
         throw error;
      }
   }
}

export default new BannerService();