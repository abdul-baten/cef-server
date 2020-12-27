import { BaseRepository } from './repository';
import { IProduct } from '../../../models/product';
import { IProductModel, ProductModel } from '../../../schema/product';

export class ProductRepository extends BaseRepository<IProduct, IProductModel> {
  constructor() {
    super(ProductModel);
  }
}
