import 'reflect-metadata';

import AccountService from '../../routes/account/service';
import { Container } from 'inversify';
import { IAccountCredentialService } from '../../models/account';
import { TYPES } from './types';

const DIContainer = new Container();

DIContainer.bind<IAccountCredentialService>(TYPES.AccountCredentials).to(AccountService);

export default DIContainer;
