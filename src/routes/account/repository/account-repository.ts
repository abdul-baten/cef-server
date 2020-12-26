import { AccountModel, IAccountModel } from '../../../schema/account';
import { BaseRepository } from './repository';
import { IAccount } from '../../../models/account';

export class AccountRepository extends BaseRepository<IAccount, IAccountModel> {
  constructor() {
    super(AccountModel);
  }

  async getLoginData(email: string): Promise<IAccount> {
    const member = await this.model
      .findOne({ email })
      .lean()
      .exec();

    if (!member) {
      return member;
    }
    return member as IAccount;
  }
}
