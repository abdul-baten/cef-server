import HttpStatus from 'http-status-codes';
import { HTTPError } from '../utils/httpErrors';
import { NextFunction, Request, Response } from 'express';

/**
 * We can validate the joi validation against request body/query/headers
 * This will select one of them. Default is request body
 *
 * @export
 * @enum {number}
 */
// eslint-disable-next-line no-shadow
export enum ValidationLevel {
  Body = 'body',
  Query = 'query',
  Params = 'params',
  Headers = 'headers'
}

const handleValidation = function validationMiddleware(
  schema: any,
  property: ValidationLevel = ValidationLevel.Body,
  isOptional: boolean = false
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (property === ValidationLevel.Query) {
        if (Object.keys(req.query).length || !isOptional) {
          // accept unknown queries and bypass validator, just validate the required queries
          await schema.validateAsync(req.query, { allowUnknown: true });
        } else {
          return next();
        }
      } else if (property === ValidationLevel.Params) {
        await schema.validateAsync(req.params);
      } else if (property === ValidationLevel.Headers) {
        // headers may contain a numbers of property like user-agent, accept, accept-encoding.
        // So we are allowing unknown but ensuring required one with schema
        await schema.validateAsync(req.headers, { allowUnknown: true });
      } else {
        await schema.validateAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof HTTPError) {
        return next(error);
      }
      const { details } = error;
      const message = details.map((err: any) => err.message).join(',');
      next(new HTTPError(message, '4000', HttpStatus.BAD_REQUEST));
    }
  };
};

export default handleValidation;
