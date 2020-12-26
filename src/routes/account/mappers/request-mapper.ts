import jsonTransformer from 'jsonata';
import { credential, regCredential } from './templates';
import { IAccount } from '../../../models/account';

class RequestMapper {
  static loginDTO(credentials: IAccount): any {
    return jsonTransformer(credential).evaluate(credentials);
  }

  static registerDTO(credentials: IAccount): any {
    return jsonTransformer(regCredential).evaluate(credentials);
  }
}

export default RequestMapper;
