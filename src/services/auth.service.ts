import { validate } from "../validations/index.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authValidation from "../validations/auth.validation";
import { ResponseError } from "../responses/error.response";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import UserModel from "../models/user.model";
import BalanceModel from "../models/balance.model";
import pool from "../configs/db.config";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "4h";

class AuthService {
   async login(request: LoginDto) {
      validate(authValidation.loginValidation, request);

      try {
         const user = await UserModel.findByEmail(request.email);
         if (!user) {
            throw new ResponseError("User not found", 404, "User not found");
         }

         const passwordValid = await bcrypt.compare(request.password, user.password);
         if (!passwordValid) {
            throw new ResponseError("Incorrect username and password combination", 400, "Incorrect username and password combination");
         }

         const tokenPayload = {
            id: user.id,
            email: user.email,
         };
         const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRATION,
         } as jwt.SignOptions);

         return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image,
            created_at: user.created_at,
            updated_at: user.updated_at,
            accessToken: accessToken,
         };
      } catch (error) {
         console.error("Error during login:", error);
         throw error;
      }
   }

   async register(request: RegisterDto) {
      validate(authValidation.registerValidation, request);
      const connection = await pool.getConnection();

      try {
         await connection.beginTransaction();

         const existingUser = await UserModel.findByEmail(request.email);
         if (existingUser) {
            throw new ResponseError("User already exists", 400, "User already exists");
         }

         const password = await bcrypt.hash(request.password, 10);
         const user = await UserModel.createUser({
               email: request.email,
               password: password,
               first_name: request.first_name,
               last_name: request.last_name || null,
               profile_image: request.profile_image || null,
            }, 
            connection
         );

         if (!user) {
            throw new ResponseError("Error creating user", 500, "Error creating user");
         }

         const userBalance = await BalanceModel.createBalance(user.id, 0, connection);
         if (!userBalance) {
            throw new ResponseError("Error creating user balance", 500, "Error creating user balance");
         }

         await connection.commit();

         return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image,
            created_at: user.created_at,
            updated_at: user.updated_at,
         }
      } catch (error) {
         await connection.rollback();
         console.error("Error during registration:", error);
         throw error;
      } finally {
         connection.release();
      }
   }
}

export default new AuthService();
