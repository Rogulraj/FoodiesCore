import { hash } from 'bcrypt';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { ReturnResponse } from '@/interfaces/returnResponse.interface';

export class UserService {
  public async findAllUser(): Promise<ReturnResponse<User[]>> {
    const users: User[] = await UserModel.find();

    const response: ReturnResponse<User[]> = { statusCode: 200, data: users, message: 'findAll' };
    return response;
  }

  public async findUserById(userId: string): Promise<ReturnResponse<User>> {
    const findUser: User = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const response: ReturnResponse<User> = { statusCode: 200, data: findUser, message: 'findOne' };

    return response;
  }

  public async createUser(userData: User): Promise<ReturnResponse<User>> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    const response: ReturnResponse<User> = { statusCode: 200, data: createUserData, message: 'user created' };

    return response;
  }

  public async updateUser(userId: string, userData: User): Promise<ReturnResponse<User>> {
    if (userData.email) {
      const findUser: User = await UserModel.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await UserModel.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    const response: ReturnResponse<User> = { statusCode: 200, data: updateUserById, message: 'user updated' };

    return response;
  }

  public async deleteUser(userId: string): Promise<ReturnResponse<User>> {
    const deleteUserById: User = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    const response: ReturnResponse<User> = { statusCode: 200, data: deleteUserById, message: 'user deleted' };

    return response;
  }
}
