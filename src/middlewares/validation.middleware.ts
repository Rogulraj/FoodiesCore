import { Transform, plainToClass, plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const BodyValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      });
  };
};

export const QueryValidationMiddelware = (type: any, skipMissingProperties: boolean = false) => {
  return (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.query);
    validateOrReject(dto, { skipMissingProperties })
      .then(() => {
        req.query = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      });
  };
};

export const ParamsValidationMiddelware = (type: any, skipMissingProperties: boolean = false) => {
  return (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.params);
    validateOrReject(dto, { skipMissingProperties })
      .then(() => {
        req.params = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(400, message));
      });
  };
};
