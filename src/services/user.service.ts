import { validate } from "../validations/index.validation";
import { ResponseError } from "../responses/error.response";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import UserModel from "../models/user.model";
import fs from "fs";
import path from "path";

class UserService {
   async profile(userId: number) {
      try {
         const user = await UserModel.findById(userId);
         if (!user) {
            throw new ResponseError("User not found", 404, "User not found");
         }

         return {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image,
         };
      } catch (error) {
         console.error("Error fetching user profile:", error);
         throw error;
      }
   }

   async updateProfile(userId: number, request: Partial<RegisterDto>) {
      try {
         const user = await UserModel.findById(userId);
         if (!user) {
            throw new ResponseError("User not found", 404, "User not found");
         }

         const updatedUser = await UserModel.updateUser(userId, request);
         if (!updatedUser) {
            throw new ResponseError("User not found", 404, "User not found");
         }

         return {
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            profile_image: updatedUser.profile_image,
         };
      } catch (error) {
         console.error("Error updating user profile:", error);
         throw error;
      }
   }

   async updateProfileImage(userId: number, imageFile: Express.Multer.File | undefined, baseUrl: string) {
      try {
         if (!imageFile) {
            throw new ResponseError("Image file is required", 400, "Image file is required");
         }

         const user = await UserModel.findById(userId);
         if (!user) {
            throw new ResponseError("User not found", 404, "User not found");
         }

         const fileName = `${userId}-${Date.now()}-${imageFile.originalname}`;
         const filePath = path.join("images/profile", fileName);
         const publicPath = path.join("public/uploads", filePath);
         
         if (!fs.existsSync("public/uploads/images/banners")) {
            fs.mkdirSync("public/uploads/images/banners", { recursive: true });
         }
         fs.writeFileSync(publicPath, imageFile.buffer);

         const fullPath = new URL(filePath, baseUrl).toString();
         const updatedUser = await UserModel.updateUser(userId, { profile_image: fullPath });
         if (!updatedUser) {
            throw new ResponseError("User not found", 404, "User not found");
         }

         return {
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            profile_image: updatedUser.profile_image,
         }
         
      } catch (error) {
         console.error("Error fetching user profile:", error);
         throw error;
      }
   }
}

export default new UserService();