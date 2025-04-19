import Joi from "joi";

class TransactionValidation {
   createValidation = Joi.object({
      service_code: Joi.string().required(),
      type: Joi.string().optional().allow("", null),
      description: Joi.string().optional().allow("", null),
      status: Joi.string().optional().allow("", null),
      total: Joi.number().optional().allow("", null),
      discount: Joi.number().optional().allow("", null),
   });
}

export default new TransactionValidation();