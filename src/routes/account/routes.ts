import AccountController from './controller';
import handleValidation from '../../middleware/validator';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import { LoginCredentials } from './validators';

export default [
  {
    path: 'v1.0.0/login',
    method: 'post',
    handler: [handleValidation(LoginCredentials), asyncWrapper(AccountController.login)]
  }
];
