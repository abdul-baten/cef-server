import ProductController from './controller';
import { asyncWrapper } from '../../middleware/asyncWrapper';

export default [
  {
    path: 'v1.0.0/product',
    method: 'get',
    handler: [asyncWrapper(ProductController.product)]
  }
];
