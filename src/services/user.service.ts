import { validate } from "../validations/index.validation";
import { ResponseError } from "../responses/error.response";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import UserModel from "../models/user.model";

const profile = async (userId: number) => {
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

const updateProfile = async (userId: number, request: Partial<RegisterDto>) => {
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

export default {
   profile,
   updateProfile,
}