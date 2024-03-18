import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { CreateUserResponse, User, UserLoginBody, UserLoginResponse } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { CommonResponse } from '@/interfaces/commonResponse.interface';

export class AuthController {
  public auth = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const signUpUserData: CommonResponse<CreateUserResponse> = await this.auth.signup(userData);

      res.status(signUpUserData.statusCode).json({ ...signUpUserData });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserLoginBody = req.body;
      const loginData: CommonResponse<UserLoginResponse> = await this.auth.login(userData);

      res.status(loginData.statusCode).json({ ...loginData });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: CommonResponse<User> = await this.auth.logout(userData);

      res.status(logOutUserData.statusCode).json({ ...logOutUserData });
    } catch (error) {
      next(error);
    }
  };
}
