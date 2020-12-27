import jsonTransformer from 'jsonata';
import { IAccount } from '../../../models/account';

class ResponseMapper {
  static login(data: any): Partial<IAccount> {
    const template = `{
			"id": _id,
			"email": email,
			"fullname": fullname
		}`;
    return jsonTransformer(template).evaluate(data);
  }
}

export default ResponseMapper;
