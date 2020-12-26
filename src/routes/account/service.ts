import 'reflect-metadata';
import RequestMapper from './mappers/request-mapper';
import { AccountErrorCodes } from './errors';
import { HTTPError } from '../../utils/httpErrors';
import { IAccount, IAccountCredentialService, IAccountResponse } from '../../models/account';
import { injectable } from 'inversify';
import { AccountRepository } from './repository/account-repository';

@injectable()
class AccountService implements IAccountCredentialService {
  private accountRepository = new AccountRepository();

  public async login(credential: IAccount): Promise<IAccountResponse> {
    try {
      // transforming credentials data
      const loginData = RequestMapper.loginDTO(credential);
      // const accessToken = await this.auth.getAccessToken();
      // const token = { accessToken } as IAuthToken;
      return { authToken: 'aa' };
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async register(credential: IAccount): Promise<IAccountResponse> {
    try {
      // transforming credentials data
      const regData = RequestMapper.registerDTO(credential);
      // const accessToken = await this.auth.getAccessToken();
      // const token = { accessToken } as IAuthToken;

      await this.accountRepository.create(regData);

      return { authToken: 'aa' };
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default AccountService;
