import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema, request: any) => {
   const { error, value } = schema.validate(request, {
      abortEarly: false,
      allowUnknown: false,
   });

   if (error) {
      throw error;
   } else {
      return value;
   }
};
