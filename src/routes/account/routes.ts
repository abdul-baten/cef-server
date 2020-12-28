import AccountController from './controller';
import handleValidation from '../../middleware/validator';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import { LoginCredentials, RegistrationCredentials } from './validators';

export default [
  {
    path: 'v1.0.0/login',
    method: 'post',
    handler: [handleValidation(LoginCredentials), asyncWrapper(AccountController.login)]
  },
  {
    path: 'v1.0.0/register',
    method: 'post',
    handler: [handleValidation(RegistrationCredentials), asyncWrapper(AccountController.register)]
  },
  {
    path: 'v1.0.0/logout',
    method: 'get',
    handler: [asyncWrapper(AccountController.logout)]
  }
];
