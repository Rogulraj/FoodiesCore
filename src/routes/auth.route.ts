import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { UserVerificationMiddleware } from '@middlewares/auth.middleware';
import { BodyValidationMiddleware } from '@middlewares/validation.middleware';
import { UserLoginDto } from '@/dtos/auth.dto';

export class AuthRoute implements Routes {
  public path = '/web';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, BodyValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post(`${this.path}/login`, BodyValidationMiddleware(UserLoginDto), this.auth.logIn);
    this.router.post(`${this.path}/logout`, UserVerificationMiddleware, this.auth.logOut);
  }
}
