export interface IAccountCredentialService {
  login(credentials: IAccount): Promise<Partial<IAccount>>;
  register(credentials: IAccount): Promise<IAccountResponse>;
}

export interface IAccount {
  email: string;
  password: string;
  fullname?: string;
}

export interface IAccountResponse {
  authToken: string;
}
