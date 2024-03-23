import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithId, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

// export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
//   try {
//     const Authorization = getAuthorization(req);

//     if (Authorization) {
//       const { _id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
//       const findUser = await UserModel.findById(_id);

//       if (findUser) {
//         req.user = findUser;
//         next();
//       } else {
//         next(new HttpException(401, 'Wrong authentication token'));
//       }
//     } else {
//       next(new HttpException(404, 'Authentication token missing'));
//     }
//   } catch (error) {
//     next(new HttpException(401, 'Wrong authentication token'));
//   }
// };

export const UserVerificationMiddleware = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { _id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req._id = findUser._id;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const BodyAuthMiddleware = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const _id = req.body._id;

    if (_id) {
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req._id = findUser._id;
        next();
      } else {
        next(new HttpException(401, 'Wrong user crediential'));
      }
    } else {
      next(new HttpException(404, 'user id missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong user crediential'));
  }
};
