import { Type } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

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

export class FoodItemDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @IsNotEmpty()
  @IsBase64()
  public imageUrl: string;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsString()
  public ingredients: string;

  @IsNotEmpty()
  @IsString()
  public nutritions: string;
}

export class UpdateFoodItemDto {
  @IsNotEmpty()
  @IsString()
  public restaurantId: string;

  @IsNotEmpty()
  @IsString()
  public categoryId: string;

  @IsNotEmptyObject()
  @IsObject()
  public item: FoodItemDto;
}

export class CategoryRestaurantIdDto {
  @IsNotEmpty()
  @IsString()
  public restaurantId: string;

  @IsNotEmpty()
  @IsString()
  public categoryId: string;
}
