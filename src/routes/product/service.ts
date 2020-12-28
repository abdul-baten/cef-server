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
      const products = await this.productRepository.find({});

      return products;
    } catch (err) {
      const { message, httpCode, errorCode } = ProductErrorCodes.NO_PRODUCT_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async product(id: number): Promise<IProduct> {
    try {
      const product = await this.productRepository.findOne({ id }, '-_id');
      if (!product) throw new Error('Product not found.');

      const response = ResponseMapper.productDetails(product);
      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = ProductErrorCodes.NO_PRODUCT_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
