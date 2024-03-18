import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';
import { ReturnResponse } from '@/interfaces/commonResponse.interface';

export const ErrorMiddleware = async (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;

    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

    const response: ReturnResponse<object> = { statusCode: status, data: {}, message: message };

    return res.status(response.statusCode).json({ ...response });
  } catch (error) {
    next(error);
  }
};
