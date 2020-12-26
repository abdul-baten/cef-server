import config from '../config/config';
import CryptoHelper from '../utils/CryptoHelper';
import fs from 'fs';
import HttpStatus from 'http-status-codes';
import IAuthToken from '../models/authToken';
import jwt from 'jsonwebtoken';
import { AuthErrorCodes } from './errors/authErrors';
import { HTTPError } from '../utils/httpErrors';
import { NextFunction, Request, Response } from 'express';

class AuthMiddleware {
  private static async jwtSign(payload: any): Promise<any> {
    const privateKEY = fs.readFileSync(config.session.rsaPrivateKey, 'utf8');
    const verifyOptions = {
      issuer: config.session.issuer,
      subject: config.session.subject,
      audience: config.session.audience,
      expiresIn: config.session.tokenLife + 'm',
      algorithm: config.session.algorithm
    };
    return jwt.sign(payload, privateKEY, verifyOptions);
  }

  static async jwtVerify(token: string): Promise<any> {
    try {
      const publicKEY = fs.readFileSync(config.session.rsaPublicKey, 'utf8');
      const verifyOptions = {
        issuer: config.session.issuer,
        subject: config.session.subject,
        audience: config.session.audience,
        expiresIn: config.session.tokenLife + 'm',
        algorithm: config.session.algorithm
      };
      const decoded: any = jwt.verify(token, publicKEY, verifyOptions);
      return { verified: true, data: decoded.data };
    } catch (e) {
      return { verified: false };
    }
  }

  public static async createToken(tokenData: IAuthToken): Promise<any> {
    try {
      const tokenInfo: IAuthToken = {
        accessToken: tokenData.accessToken
      };
      const payload = {
        data: CryptoHelper.encrypt(JSON.stringify(tokenInfo), config.session.tokenEncryptionKey)
      };

      return this.jwtSign(payload);
    } catch (err) {
      const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return new HTTPError(HttpStatus.getStatusText(httpCode), String(httpCode), httpCode);
    }
  }

  public static async isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const reqToken = req.cookies.authToken;
      if (!reqToken) {
        const { message, errorCode, httpCode } = AuthErrorCodes.AUTH_TOKEN_MISSING;
        return next(new HTTPError(message, errorCode, httpCode));
      }

      let decoded = await AuthMiddleware.jwtVerify(reqToken);
      if (!decoded.verified) {
        const { message, errorCode, httpCode } = AuthErrorCodes.AUTH_TOKEN_INVALID;
        return next(new HTTPError(message, errorCode, httpCode));
      }

      decoded = CryptoHelper.decrypt(decoded.data, config.session.tokenEncryptionKey);
      decoded = JSON.parse(decoded);

      /**
       * we are assumeing that bankToken will be available after successfully logged in
       */
      if (!decoded.bankToken) {
        const { message, errorCode, httpCode } = AuthErrorCodes.NOT_AUTHENTICATED;
        return next(new HTTPError(message, errorCode, httpCode));
      }

      const tokenInfo: IAuthToken = {
        accessToken: decoded.accessToken
      };
      const payload = {
        data: CryptoHelper.encrypt(JSON.stringify(tokenInfo), config.session.tokenEncryptionKey)
      };

      /**
       * After verify we are doing jwtSign to increase the token life time
       */
      const signedToken = await AuthMiddleware.jwtSign(payload);
      res.cookie('authToken', signedToken, { httpOnly: true, secure: true, sameSite: 'none' });

      return next();
    } catch (err) {
      const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return new HTTPError(HttpStatus.getStatusText(httpCode), String(httpCode), httpCode);
    }
  }
}

export default AuthMiddleware;
