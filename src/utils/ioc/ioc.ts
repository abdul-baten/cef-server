import AccountService from '../../routes/account/service';
import ProductService from '../../routes/product/service';
import { Container } from 'inversify';
import { IAccountService } from '../../models/account';
import { IProductService } from '../../models/product';
import { TYPES } from './types';
import 'reflect-metadata';

const DIContainer = new Container();

DIContainer.bind<IAccountService>(TYPES.Account).to(AccountService);
DIContainer.bind<IProductService>(TYPES.Product).to(ProductService);

export default DIContainer;
