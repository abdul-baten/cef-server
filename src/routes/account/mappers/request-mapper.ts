import jsonTransformer from 'jsonata';
import { credential } from './templates';
import { IAccount } from '../../../models/account';

class RequestMapper {
  static loginDTO(credentials: IAccount): any {
    return jsonTransformer(credential).evaluate(credentials);
  }
}

export default RequestMapper;
