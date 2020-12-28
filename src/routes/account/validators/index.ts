import Joi from 'joi';

export const LoginCredentials = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});

export const RegistrationCredentials = Joi.object({
  email: Joi.string().required(),
  fullname: Joi.string().optional(),
  password: Joi.string().required()
});

export const AccountCart = Joi.object({
  id: Joi.string().required(),
  product: Joi.string().required()
});
