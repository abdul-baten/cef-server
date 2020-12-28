import handleValidation, { ValidationLevel } from '../../middleware/validator';
import ProductController from './controller';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import { ProductIdValidate } from './validators';

export default [
  {
    path: 'v1.0.0/product',
    method: 'get',
    handler: [asyncWrapper(ProductController.products)]
  },
  {
    path: 'v1.0.0/product/:id',
    method: 'get',
    handler: [
      handleValidation(ProductIdValidate, ValidationLevel.Params, true),
      asyncWrapper(ProductController.product)
    ]
  }
];
