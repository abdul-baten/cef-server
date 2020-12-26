export const AccountErrorCodes = Object.freeze({
  INCORRECT_CREDENTIALS: {
    message: 'Username or password is incorrect',
    errorCode: '402',
    httpCode: 401
  },
  TOKEN_EXPIRED: {
    message: 'Token expired',
    errorCode: '706',
    httpCode: 403
  },
  NO_MEMBER_FOUND: {
    message: 'No user found',
    errorCode: '410',
    httpCode: 404
  },
  USER_EXISTS: {
    message: 'User already exists in system',
    errorCode: '414',
    httpCode: 409
  }
});
