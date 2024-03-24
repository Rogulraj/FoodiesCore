import { IsNotEmpty } from 'class-validator';

export class CategoryQueryDto {
  @IsNotEmpty()
  public restaurantId: string;

  @IsNotEmpty()
  public category: string;
}

export class IdParamDto {
  @IsNotEmpty()
  public id: string;
}
