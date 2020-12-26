import compression from 'compression';
import config from '../config/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import httpContext from 'express-http-context';
import logger from '../utils/logger';
import morgan from 'morgan';
import parser from 'body-parser';
import Utils from '../utils/utils';
import { NextFunction, Request, Response, Router } from 'express';
import { pathToRegexp } from 'path-to-regexp';
import { v4 as uuidv4 } from 'uuid';

const morganFormat = process.env.NODE_ENV !== 'production' ? 'common' : 'combined';

export const handleCors = (router: Router) =>
  router.use(
    cors({
      credentials: true,
      origin: true
    })
  );

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCookieParsing = (router: Router) => {
  router.use(cookieParser());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const loggingMiddleware = (router: Router) => {
  // required to set the context for it to logged later on
  router.use(httpContext.middleware);

  // silent http logger in test environment
  if (process.env.NODE_ENV !== 'test') {
    router.use(
      morgan(morganFormat, {
        skip: (req: Request, res: Response) => {
          return res.statusCode >= 400;
        },
        stream: process.stderr
      })
    );

    router.use(
      morgan(morganFormat, {
        skip: (req: Request, res: Response) => {
          return res.statusCode < 400;
        },
        stream: process.stdout
      })
    );
  }

  // set some logging parameters
  router.use((req: Request, res: Response, next: NextFunction): void => {
    // required otherwise context will be lost between other calls
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);
    const urlPath = `${req.method.toLowerCase()}:${req.url
      .split('/')
      .slice(3)
      .join('/')
      .replace(/(\/\?.*|\?.*)/gi, '')}`;

    // dynamically matching logger constant from request url
    // to get location and action
    httpContext.set('loggingContext', {
      requestUrl: req.url,
      httpMethod: req.method,
      headers: req.headers,
      queries: req.query
    });

    next();
  });

  // set logging correlation id
  router.use((req: Request, res: Response, next: NextFunction) => {
    // this is used to correlate multiple individual calls
    // thus acting like a session id for logging purposes
    const correlationId = req.header('Correlation-Id') || uuidv4();

    // this is an individual log id for the current call, which can be sent
    // to third party clients which are called as part of this api call.
    // we will send this to axiome as part of the axiom-uuid header.
    const requestId = uuidv4();

    // sending Correlation-Id to client
    res.set('Correlation-Id', correlationId);
    // now lets set these values so that when we log they will appear as part of the log call
    const context = httpContext.get('loggingContext');

    if (!req.get('correlation-id')) {
      context.headers['correlation-id'] = correlationId;
    }

    httpContext.set('loggingContext', { ...context, requestId });

    next();
  });

  // this is where the actual logging takes place once a successful message completes
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      // If the request come to the health route then
      // we are skiping form logging that
      const healthRoute = req.url.split('/').slice(3)[0] === 'health';
      if (healthRoute) return;
      if (req.method.toLowerCase() === 'options') return;

      const context = Utils.sanitizeLog({
        ...httpContext.get('loggingContext'),
        ...(req.body && Object.keys(req.body).length && { body: req.body }),
        sourceIp: Utils.getIpAddress(),
        remoteHost: req.headers['x-forwarded-for'] || '',
        deployment: config.logging.deployment,
        date: new Date().toISOString()
      });
      // loggingContext is only defined if we reach the controller function
      // loggingContext will not be defined if a validation middleware error is thrown

      // reset apiLogs array to empty array

      // checking if loggingcontext has error key bacause if error happen
      // error logger will log that we don't need to log 2 times
      if (!context.isError) {
        logger.info('{}', context);
        // logger.info(JSON.stringify(context), logMeta);
      } else {
        delete context.isError;
        const { errorMessage } = context;
        delete context.errorMessage;
        logger.error(errorMessage, context);
      }
    });
    next();
  });

  // this function does a callback when we set the json body on the response
  // so we can hook up into that process and set the logging context
  router.use((req: Request, res: Response, next: NextFunction): void => {
    const json = res.json;
    res.json = (obj: any): any => {
      httpContext.set('loggingContext', { ...httpContext.get('loggingContext'), ...(obj && { response: obj }) });
      json.call(res, obj);
    };
    next();
  });
};
