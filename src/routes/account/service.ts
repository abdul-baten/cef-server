import RequestMapper from './mappers/request-mapper';
import ResponseMapper from './mappers/response-mapper';
import { AccountErrorCodes } from './errors';
import { AccountRepository } from './repository/account-repository';
import { HTTPError } from '../../utils/httpErrors';
import { IAccount, IAccountService } from '../../models/account';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
class AccountService implements IAccountService {
  private accountRepository = new AccountRepository();

  public async login(credential: IAccount): Promise<IAccount> {
    try {
      const { email } = RequestMapper.loginDTO(credential);
      const user = await this.accountRepository.findOne({ email }, null, 'products');
      if (!user) {
        const { message, httpCode, errorCode } = AccountErrorCodes.NO_USER_FOUND;
        throw new HTTPError(message, errorCode, httpCode);
      }

      const { password } = user;
      if (password !== credential.password) throw new Error('User not found!');

      const response = ResponseMapper.login(user);

      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async register(credential: IAccount): Promise<IAccount> {
    try {
      const regData = RequestMapper.registerDTO(credential);
      const response = await this.accountRepository.create(regData);

      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async logout(): Promise<Record<string, boolean>> {
    try {
      return { success: true };
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.LOGGED_OUT;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async addToCart(id: string, product: string): Promise<IAccount> {
    try {
      const update = await this.accountRepository.findOneAndUpdate(
        { _id: id },
        { $push: { products: product } },
        { new: true },
        'products'
      );
      const response = ResponseMapper.cart(update);

      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async removeFromCart(id: string, product: string): Promise<IAccount> {
    try {
      const update = await this.accountRepository.findOneAndUpdate(
        { _id: id },
        { $pull: { products: product } },
        { new: true },
        'products'
      );
      const response = ResponseMapper.cart(update);

      return response;
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default AccountService;
