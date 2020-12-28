import { IProduct } from './product';

export interface IAccountService {
  login(credentials: IAccount): Promise<Partial<IAccount>>;
  register(credentials: IAccount): Promise<IAccount>;
  logout(): Promise<Record<string, boolean>>;
  addToCart(id: string, product: string): Promise<IAccount>;
  removeFromCart(id: string, product: string): Promise<IAccount>;
}

export interface IAccount {
  email: string;
  fullname?: string;
  password: string;
  products?: IProduct[];
}
