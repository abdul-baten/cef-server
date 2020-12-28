import AccountService from '../../routes/account/service';
import ProductService from '../../routes/product/service';
import { Container } from 'inversify';
import { IAccountCredentialService } from '../../models/account';
import { IProductService } from '../../models/product';
import { TYPES } from './types';
import 'reflect-metadata';

const DIContainer = new Container();

DIContainer.bind<IAccountCredentialService>(TYPES.AccountCredentials).to(AccountService);
DIContainer.bind<IProductService>(TYPES.Product).to(ProductService);

export default DIContainer;
