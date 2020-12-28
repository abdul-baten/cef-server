import DIContainer from '../../utils/ioc/ioc';
import { IProductService } from '../../models/product';
import { Request, Response } from 'express';
import { TYPES } from '../../utils/ioc/types';

export default class ProductController {
  public static async products(_req: Request, res: Response): Promise<void> {
    const service = DIContainer.get<IProductService>(TYPES.Product);
    const response = await service.products();

    res.status(200).json(response);
  }

  public static async product(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const service = DIContainer.get<IProductService>(TYPES.Product);
    const response = await service.product(id);

    res.status(200).json(response);
  }
}
