import Joi from 'joi';

export const LoginCredentials = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});
