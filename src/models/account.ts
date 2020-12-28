import { IProduct } from './product';

export interface IAccountService {
  login(credentials: IAccount): Promise<Partial<IAccount>>;
  register(credentials: IAccount): Promise<IAccount>;
  logout(): Promise<Record<string, boolean>>;
}

export interface IAccount {
  email: string;
  fullname?: string;
  password: string;
  product?: IProduct[];
}

export interface IAccountResponse {
  authToken: string;
}
