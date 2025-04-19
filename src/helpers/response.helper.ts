import { Response } from "express";

class WebResponse {
   static success(res: Response, statusCode: number = 0, message: string = "Sukses", data: any = null): void {
      let response: any = {
         status: this.statusCodeMapping(statusCode),
         message: message,
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

   static error(res: Response, statusCode: number = 102, message: string = "Gagal", errors: any = null): void {
      let response: any = {
         status: this.statusCodeMapping(statusCode),
         message: message,
         data: null,
      };

      if (errors) {
         response["errors"] = errors;
      }

      res.status(statusCode).json(response).end();
   }

   static statusCodeMapping (statusCode: number): number {
      switch (statusCode) {
         case 200:
            return 0;
         case 201:
            return 0;
         case 204:
            return 0;
         case 400:
            return 102;
         case 401:
            return 108;
         case 403:
            return 102;
         case 404:
            return 102;
         case 500:
            return 102;
         default:
            return statusCode;
      }
   }
}

export default WebResponse;
