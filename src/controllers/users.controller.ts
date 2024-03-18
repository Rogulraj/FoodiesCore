import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { CommonResponse } from '@/interfaces/commonResponse.interface';

export class UserController {
  public user = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: CommonResponse<User[]> = await this.user.findAllUser();

      res.status(findAllUsersData.statusCode).json({ ...findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: CommonResponse<User> = await this.user.findUserById(userId);

      res.status(findOneUserData.statusCode).json({ ...findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const createUserData: CommonResponse<User> = await this.user.createUser(userData);

      res.status(createUserData.statusCode).json({ ...createUserData });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const updateUserData: CommonResponse<User> = await this.user.updateUser(userId, userData);

      res.status(updateUserData.statusCode).json({ ...updateUserData });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: CommonResponse<User> = await this.user.deleteUser(userId);

      res.status(deleteUserData.statusCode).json({ ...deleteUserData });
    } catch (error) {
      next(error);
    }
  };
}
