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
  NO_USER_FOUND: {
    message: 'No user found',
    errorCode: '410',
    httpCode: 404
  },
  USER_EXISTS: {
    message: 'User already exists in system',
    errorCode: '414',
    httpCode: 409
  },
  LOGGED_OUT: {
    message: 'Logged out already.',
    errorCode: '415',
    httpCode: 500
  }
});
