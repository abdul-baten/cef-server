import DIContainer from '../../utils/ioc/ioc';
import { IProductService } from '../../models/product';
import { Request, Response } from 'express';
import { TYPES } from '../../utils/ioc/types';

export default class ProductController {
  public static async product(req: Request, res: Response): Promise<void> {
    const service = DIContainer.get<IProductService>(TYPES.ProductCredentials);
    const response = await service.product();

    res.status(200).json(response);
  }
}
