import * as ErrorHandler from '../utils/ErrorHandler';
import httpContext from 'express-http-context';
import { NextFunction, Request, Response, Router } from 'express';

const handle404Error = (router: Router) => {
  router.use((_req: Request, _res: Response) => {
    ErrorHandler.notFoundError();
  });
};

const errorLogger = (router: Router) => {
  router.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
    const context = httpContext.get('loggingContext');

    httpContext.set('loggingContext', { ...context, isError: true, errorMessage: err.message, stackTrace: err.stack });
    next(err);
  });
};

const handleClientError = (router: Router) => {
  router.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.clientError(err, res, next);
  });
};

const handleServerError = (router: Router) => {
  router.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.serverError(err, res, next);
  });
};

export default [handle404Error, errorLogger, handleClientError, handleServerError];
