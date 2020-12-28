import AuthMiddleware from '../../middleware/authMiddleware';
import DIContainer from '../../utils/ioc/ioc';
import ResponseMapper from './mappers/response-mapper';
import { IAccount, IAccountService } from '../../models/account';
import { Request, Response } from 'express';
import { TYPES } from '../../utils/ioc/types';

class AccountController {
  public static async login(req: Request, res: Response): Promise<void> {
    const userCredentials: IAccount = req.body;
    const service = DIContainer.get<IAccountService>(TYPES.Account);
    const response = await service.login(userCredentials);
    const token = await AuthMiddleware.createToken(response.email);

    res.cookie('authToken', token, { httpOnly: true, secure: false });
    res.status(200).json(response);
  }

  public static async register(req: Request, res: Response): Promise<void> {
    const userCredentials: IAccount = req.body;
    const service = DIContainer.get<IAccountService>(TYPES.Account);
    const response = await service.register(userCredentials);

    res.status(200).json(response);
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    const service = DIContainer.get<IAccountService>(TYPES.Account);
    const response = await service.logout();

    res.clearCookie('authToken');
    res.status(200).json(response);
  }
}

export default AccountController;
