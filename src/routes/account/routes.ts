import AccountController from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation from '../../middleware/validator';
import { AccountCart, LoginCredentials, RegistrationCredentials } from './validators';
import { asyncWrapper } from '../../middleware/asyncWrapper';

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
  },
  {
    path: 'v1.0.0/add',
    method: 'patch',
    handler: [handleValidation(AccountCart), AuthMiddleware.isAuthenticated, asyncWrapper(AccountController.addToCart)]
  },
  {
    path: 'v1.0.0/remove',
    method: 'patch',
    handler: [
      handleValidation(AccountCart),
      AuthMiddleware.isAuthenticated,
      asyncWrapper(AccountController.removeFromCart)
    ]
  }
];
