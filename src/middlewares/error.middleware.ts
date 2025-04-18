import pkg from 'joi';
import WebResponse from '../helpers/response.helper';
import { ResponseError } from '../responses/error.response';

const {ValidationError} = pkg;

const errorMiddleware = (err: any, req: any, res: any, next: any) => {
   if (!err) {
      return next();
   }

   if (err instanceof ResponseError) {
      console.log("ResponseError");
      WebResponse.error(res, err.status, err.errors);
   } else if (err instanceof ValidationError) {
      console.log("ValidationError");
      const errors = err.details.map((detail: any) => {
         return {
            message: detail.message.replace(/\"/g, ''),
            path: detail.path.join('.')
         };
      });

      WebResponse.error(res, 400, errors);
   } else {
      console.log("Error");
      WebResponse.error(res, 500, err.message);
   }
}

export {errorMiddleware};