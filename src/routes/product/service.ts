import ResponseMapper from './mappers/response-mapper';
import { HTTPError } from '../../utils/httpErrors';
import { injectable } from 'inversify';
import { IProduct, IProductService } from '../../models/product';
import { ProductErrorCodes } from './errors';
import { ProductRepository } from './repository/product-repository';
import 'reflect-metadata';

@injectable()
export default class ProductService implements IProductService {
  private productRepository = new ProductRepository();

  public async products(): Promise<IProduct[]> {
    try {
      const response = [];
      const products = await this.productRepository.find({});

      for (let i = 0; i < products.length; i++) {
        response.push(ResponseMapper.productDetails(products[i]));
      }

      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = ProductErrorCodes.NO_PRODUCT_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async product(id: string): Promise<IProduct> {
    try {
      const product = await this.productRepository.findOne({ _id: id });
      if (!product) throw new Error('Product not found.');

      const response = ResponseMapper.productDetails(product);
      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = ProductErrorCodes.NO_PRODUCT_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
