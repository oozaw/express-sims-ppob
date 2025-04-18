import Joi from 'joi';

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().optional().allow('', null),
  profile_image: Joi.string().optional().allow('', null),
});

export { loginValidation, registerValidation };