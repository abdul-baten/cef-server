import Joi from 'joi';

export const ProductIdValidate = Joi.object({
  id: Joi.string().required()
});
