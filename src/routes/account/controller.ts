import AuthMiddleware from '../../middleware/authMiddleware';
import DIContainer from '../../utils/ioc/ioc';
import ResponseMapper from './mappers/response-mapper';
import { IAccount, IAccountCredentialService } from '../../models/account';
import { Request, Response } from 'express';
import { TYPES } from '../../utils/ioc/types';

class AccountController {
  public static async login(req: Request, res: Response): Promise<void> {
    const userCredentials: IAccount = req.body;
    const service = DIContainer.get<IAccountCredentialService>(TYPES.AccountCredentials);
    const response = await service.login(userCredentials);
    const token = await AuthMiddleware.createToken({ accessToken: response.email });

    res.cookie('authToken', token, { httpOnly: true, secure: true });
    res.status(200).json({ ...response });
  }

  public static async register(req: Request, res: Response): Promise<void> {
    const userCredentials: IAccount = req.body;
    const service = DIContainer.get<IAccountCredentialService>(TYPES.AccountCredentials);
    const user = await service.register(userCredentials);

    res.status(200).json({ ...user });
  }
}

export default AccountController;
