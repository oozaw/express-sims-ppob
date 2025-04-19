import Joi from "joi";

class BalanceValidation {
   topUpValidation = Joi.object({
      service_id: Joi.number().optional().allow("", null),
      type: Joi.string().optional().allow("", null),
      description: Joi.string().optional().allow("", null),
      status: Joi.string().optional().allow("", null),
      top_up_amount: Joi.number().required().min(1),
      discount: Joi.number().optional().allow("", null),
   });
}

export default new BalanceValidation();