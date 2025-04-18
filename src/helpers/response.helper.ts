import { Response } from "express";
import * as http from "http";

class WebResponse {
   static success(res: Response, statusCode: number, data: any = null): void {
      let response: any = {
         status: http.STATUS_CODES[statusCode]?.toUpperCase(),
         code: statusCode,
      };

      if (data) {
         response["data"] = data;

         if (data.hasOwnProperty("metadata")) {
            response["metadata"] = data.metadata;
            delete data.metadata;
         }

         if (data.hasOwnProperty("data")) {
            response["data"] = data.data;
            delete data.data;
         }
      }

      res.status(statusCode).json(response).end();
   }

   static error(res: Response, statusCode: number, errors: any = null): void {
      let response: any = {
         status: http.STATUS_CODES[statusCode]?.toUpperCase(),
         code: statusCode,
      };

      if (errors) {
         response["errors"] = errors;
      }

      res.status(statusCode).json(response).end();
   }
}

export default WebResponse;
