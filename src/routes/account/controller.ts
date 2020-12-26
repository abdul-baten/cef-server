import DIContainer from '../../utils/ioc/ioc';
import { IAccount, IAccountCredentialService } from '../../models/account';
import { Request, Response } from 'express';
import { TYPES } from '../../utils/ioc/types';

class AccountController {
  public static async login(req: Request, res: Response): Promise<void> {
    const userCredentials: IAccount = req.body;
    const service = DIContainer.get<IAccountCredentialService>(TYPES.AccountCredentials);
    const user = await service.login(userCredentials);

    res.status(200).json({ ...user });
  }

  public static async register(req: Request, res: Response): Promise<void> {
    const userCredentials: IAccount = req.body;
    const service = DIContainer.get<IAccountCredentialService>(TYPES.AccountCredentials);
    const user = await service.register(userCredentials);

    res.status(200).json({ ...user });
  }
}

export default AccountController;
