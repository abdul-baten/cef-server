import jsonTransformer from 'jsonata';
import { accountResponse } from './templates';
import { IAccount } from '../../../models/account';

class ResponseMapper {
  static login(data: any): IAccount {
    return jsonTransformer(accountResponse).evaluate(data);
  }

  static cart(data: any): IAccount {
    return jsonTransformer(accountResponse).evaluate(data);
  }
}

export default ResponseMapper;
