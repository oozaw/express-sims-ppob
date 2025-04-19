import BannerModel from "../models/banner.model";

class BannerService {
   async getAllBanners(query: any): Promise<BannerModel[]> {
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