import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { CreateUserResponse, User, UserLoginBody, UserLoginResponse } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { CommonResponse } from '@/interfaces/commonResponse.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

// const createCookie = (tokenData: TokenData): string => {
//   return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
// };

export class AuthService {
  public async signup(userData: User): Promise<CommonResponse<CreateUserResponse>> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    const requiredData: CreateUserResponse = { _id: createUserData._id, email: createUserData.email, accountType: createUserData.accountType };

    const response: CommonResponse<CreateUserResponse> = { statusCode: 201, data: requiredData, message: 'signup success' };

    return response;
  }

  public async login(userData: UserLoginBody): Promise<CommonResponse<UserLoginResponse>> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser);

    const response: CommonResponse<UserLoginResponse> = {
      statusCode: 200,
      data: { _id: findUser._id, email: findUser.email, tokenData },
      message: 'login success',
    };

    return response;
  }

  public async logout(userData: User): Promise<CommonResponse<User>> {
    const findUser: User = await UserModel.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const response: CommonResponse<User> = { statusCode: 200, data: findUser, message: 'logout' };
    return response;
  }
}
