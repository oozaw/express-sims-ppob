import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import WebResponse from "../helpers/response.helper"
import User, { UserAttributes } from "../models/user.model";


declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authorizationHeader = req.headers["authorization"];
      const accessToken = authorizationHeader?.split(" ")[1];
      if (!accessToken) {
         return WebResponse.error(res, 401, "Access token is missing");
      }

      jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string, async (err: any, decoded: any) => {
         if (err) {
            if (err.name === "TokenExpiredError") {
               return WebResponse.error(res, 401, "Access token expired");
            } else {
               return WebResponse.error(res, 401, "Invalid access token");
            }
         } else {
            const user = await User.findById(decoded.id);
            if (!user) {
               return WebResponse.error(res, 404, "User not found");
            }
            
            req.user = user;
            next();
         }
      });
   } catch (error) {
      return WebResponse.error(res, 500, "Server error");
   }
};

export default authMiddleware;
