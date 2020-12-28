import jsonTransformer from 'jsonata';
import { accountRequest } from './templates';
import { IAccount } from '../../../models/account';

class RequestMapper {
  static loginDTO(credentials: IAccount): IAccount {
    return jsonTransformer(accountRequest).evaluate(credentials);
  }

  static registerDTO(credentials: IAccount): any {
    return jsonTransformer(accountRequest).evaluate(credentials);
  }
}

export default RequestMapper;
