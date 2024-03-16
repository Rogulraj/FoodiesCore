import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, UserWithCookie } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { ReturnResponse } from '@/interfaces/returnResponse.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

export class AuthService {
  public async signup(userData: User): Promise<ReturnResponse<User>> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    const response: ReturnResponse<User> = { statusCode: 201, data: createUserData, message: 'signup' };

    return response;
  }

  public async login(userData: User): Promise<ReturnResponse<UserWithCookie>> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    const response: ReturnResponse<UserWithCookie> = { statusCode: 200, data: { ...findUser, cookie }, message: 'login' };

    return response;
  }

  public async logout(userData: User): Promise<ReturnResponse<User>> {
    const findUser: User = await UserModel.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const response: ReturnResponse<User> = { statusCode: 200, data: findUser, message: 'logout' };
    return response;
  }
}
