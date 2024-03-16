import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User, UserWithCookie } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { ReturnResponse } from '@/interfaces/returnResponse.interface';

export class AuthController {
  public auth = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const signUpUserData: ReturnResponse<User> = await this.auth.signup(userData);

      res.status(signUpUserData.statusCode).json({ ...signUpUserData });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const loginData: ReturnResponse<UserWithCookie> = await this.auth.login(userData);

      // res.setHeader('Set-Cookie', [loginData.data.cookie]);
      res.status(loginData.statusCode).json({ ...loginData });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: ReturnResponse<User> = await this.auth.logout(userData);

      // res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(logOutUserData.statusCode).json({ ...logOutUserData });
    } catch (error) {
      next(error);
    }
  };
}
