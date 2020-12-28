import jsonTransformer from 'jsonata';
import { IProduct } from '../../../models/product';
import { productDetails } from './templates';

export default class ResponseMapper {
  static productDetails(data: any): IProduct {
    return jsonTransformer(productDetails).evaluate(data);
  }
}
