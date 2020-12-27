import 'reflect-metadata';
import RequestMapper from './mappers/request-mapper';
import { AccountErrorCodes } from './errors';
import { HTTPError } from '../../utils/httpErrors';
import { IAccount, IAccountCredentialService, IAccountResponse } from '../../models/account';
import { injectable } from 'inversify';
import { AccountRepository } from './repository/account-repository';
import ResponseMapper from './mappers/response-mapper';

@injectable()
class AccountService implements IAccountCredentialService {
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

  public async register(credential: IAccount): Promise<IAccountResponse> {
    try {
      const regData = RequestMapper.registerDTO(credential);
      await this.accountRepository.create(regData);

      return { authToken: 'aa' };
    } catch (err) {
      const { message, httpCode, errorCode } = AccountErrorCodes.INCORRECT_CREDENTIALS;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default AccountService;
