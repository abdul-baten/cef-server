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

  public async login(credential: IAccount): Promise<Partial<IAccount>> {
    try {
      const loginData = RequestMapper.loginDTO(credential);
      const user = await this.accountRepository.findOne({ email: loginData.email });
      if (!user) throw new Error('User not found!');

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { email, _id, fullname, password } = user;
      if (password !== credential.password) throw new Error('User not found!');

      const response = ResponseMapper.login({ email, _id, fullname });

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
}

export default AccountService;
