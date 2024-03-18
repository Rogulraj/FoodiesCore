import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  public password: string;
}
