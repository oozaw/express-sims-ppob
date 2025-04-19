import serviceModel, { ServiceAttributes } from "../models/service.model";

class ServiceService {
   async getAllServices(query: any): Promise<ServiceAttributes[]> {
      try {
         const services = await serviceModel.findAll();
         return services;
      } catch (error) {
         console.error("Error fetching all services:", error);
         throw error;
      }
   }
}

export default new ServiceService();