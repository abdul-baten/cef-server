import { AccountErrorCodes } from './errors';
import { ProductRepository } from './repository/product-repository';
import { HTTPError } from '../../utils/httpErrors';
import { injectable } from 'inversify';
import { IProduct, IProductService } from '../../models/product';
import 'reflect-metadata';

@injectable()
export default class ProductService implements IProductService {
  private productRepository = new ProductRepository();

  public async product(): Promise<IProduct[]> {
    try {
      const products = await this.productRepository.find({});

      return products;
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
