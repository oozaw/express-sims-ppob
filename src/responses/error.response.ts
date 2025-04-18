class ResponseError extends Error {
   status: number;
   errors: any;

   constructor(message: string, statusCode: number, errors: any = null) {
      super(message);
      this.status = statusCode;
      this.errors = errors;
   }
}

export { ResponseError };