import { IAccount } from '../../models/account';
import { NextFunction, Request, Response } from 'express';

class AccountController {
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userCredentials: IAccount = req.body;

    res.status(200).json({ userCredentials });
  }
}

export default AccountController;
