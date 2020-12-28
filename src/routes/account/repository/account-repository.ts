import { AccountModel, IAccountModel } from '../../../schema/account';
import { BaseRepository } from './repository';
import { IAccount } from '../../../models/account';

export class AccountRepository extends BaseRepository<IAccount, IAccountModel> {
  constructor() {
    super(AccountModel);
  }
}
