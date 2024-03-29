import { HttpException } from '@/exceptions/httpException';
import { StoreBase64Image } from '@/helpers/base64.helper';
import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdNameResponse, IdResponse } from '@/interfaces/commonResponse.interface';
import { AddMenuBody, MenuCategoryItems, MenuType, RestaurantType } from '@/interfaces/restaurant.interface';
import { RestaurantModel } from '@/models/restaurant.model';

export class RestaurantService {
  public async createRestaurant(userData: RestaurantType): Promise<CommonResponse<RestaurantType>> {
    // store base64 image in db
    const imagePath = await StoreBase64Image(userData.imageUrl);
    if (!imagePath) throw new HttpException(500, 'Image Not store in db.');
    userData.imageUrl = imagePath;

    const createData = await RestaurantModel.create(userData);

    const response: CommonResponse<RestaurantType> = { statusCode: 201, data: createData, message: 'restaurant created' };
    return response;
  }

  public async getAllRestaurants(): Promise<CommonResponse<RestaurantType[]>> {
    const findOne = await RestaurantModel.find();

    const responseData: CommonResponse<RestaurantType[]> = { statusCode: 200, data: findOne, message: 'restaurant data' };
    return responseData;
  }

  public async getRestaurantById(restaurantId: string): Promise<CommonResponse<RestaurantType>> {
    const findOne = await RestaurantModel.findOne({ _id: restaurantId });

    const responseData: CommonResponse<RestaurantType> = { statusCode: 200, data: findOne, message: 'restaurant data' };
    return responseData;
  }

  public async addMenuCategory(userId: RequestWithId['_id'], userData: AddMenuBody): Promise<CommonResponse<IdNameResponse>> {
    const findData = await RestaurantModel.findOne({ _id: userId });
    const category = userData.category;

    console.log(findData);
    const menuItem = findData.menu.find(item => item.category === category);

    if (menuItem) throw new HttpException(409, `This category ${userData.category} already exists`);
    findData.menu.push({
      category: category,
      items: [],
    });
    const update: RestaurantType = await findData.save();

    const response: CommonResponse<IdNameResponse> = {
      statusCode: 201,
      data: { _id: update._id, name: update.name },
      message: 'menu category added',
    };
    return response;
  }

  public async addMenuItem(userId: RequestWithId['_id'], userData: AddMenuBody): Promise<CommonResponse<IdNameResponse>> {
    // store base64 image in db
    const imagePath = await StoreBase64Image(userData.item.imageUrl);
    if (!imagePath) throw new HttpException(500, 'Image Not store in db.');
    userData.item.imageUrl = imagePath;

    const findData = await RestaurantModel.findOne({ _id: userId });
    const category = userData.category;
    const item = userData.item;

    const menuItem = findData.menu.find(item => item.category === category);
    if (!menuItem) throw new HttpException(409, `This category ${userData.category}  does not exists`);
    menuItem.items.push(item);
    const update = await findData.save();

    const response: CommonResponse<IdNameResponse> = { statusCode: 201, data: { _id: update._id, name: update.name }, message: 'menu item added' };
    return response;
  }

  public async getAllMenuItems(restaurantId: string): Promise<CommonResponse<MenuType[]>> {
    const findRestaurant = await RestaurantModel.findById(restaurantId);
    if (!findRestaurant) throw new HttpException(409, 'This restaurant does not exists');

    const menuList: MenuType[] = findRestaurant.menu;

    const data: CommonResponse<MenuType[]> = { statusCode: 200, data: menuList, message: 'Menu items fetched' };
    return data;
  }

  public async getFoodById(foodId: string, restaurantId: string, category: string): Promise<CommonResponse<MenuCategoryItems>> {
    const findFoodData = await RestaurantModel.findById(restaurantId);
    console.log(findFoodData);
    if (!findFoodData) throw new HttpException(409, 'Restaurant does not exists');

    const categoryIndex: number = findFoodData.menu.findIndex(item => item.category === category);
    if (categoryIndex === -1) throw new HttpException(409, 'Category does not exists');

    const foodData = findFoodData.menu[categoryIndex].items.find(food => food._id.toString() === foodId);
    if (!foodData) throw new HttpException(409, 'Food Does not exists');

    const data: MenuCategoryItems = foodData;

    const response: CommonResponse<MenuCategoryItems> = { statusCode: 200, data: data, message: 'food data fetched.' };
    return response;
  }

  public async updateFoodById(
    foodId: string,
    restaurantId: string,
    categoryId: string,
    item: MenuCategoryItems,
  ): Promise<CommonResponse<IdResponse>> {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) throw new HttpException(409, 'Restaurant does not exists');

    const category = restaurant.menu.find(item => item._id.toString() === categoryId);
    if (!category) throw new HttpException(409, 'Category does not exists');

    const foodIndex = category.items.findIndex(food => food._id.toString() === foodId);
    if (foodIndex === -1) throw new HttpException(409, 'Food does not exists');

    const foodData = category.items[foodIndex];
    category.items[foodIndex] = { ...foodData, ...item };

    await restaurant.save();
    const response: CommonResponse<IdResponse> = { statusCode: 200, data: { _id: foodId }, message: 'food item updated' };
    return response;
  }

  public async removeFoodById(foodId: string, restaurantId: string, categoryId: string): Promise<CommonResponse<IdResponse>> {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) throw new HttpException(409, 'Restaurant Does not exists');

    const category = restaurant.menu.find(item => item._id.toString() === categoryId);
    if (!category) throw new HttpException(409, 'Category Does not exists');

    const foodIndex = category.items.findIndex(food => food._id.toString() === foodId);
    if (foodIndex === -1) throw new HttpException(409, 'Food Does not exists');

    category.items.splice(foodIndex, 1);

    await restaurant.save();
    const response: CommonResponse<IdResponse> = { statusCode: 200, data: { _id: foodId }, message: 'food deleted' };
    return response;
  }

  public async removeMenuCategaory(restaurantId: string, categoryId: string): Promise<CommonResponse<MenuType>> {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) throw new HttpException(409, 'Restaurant Does not exists');

    const categoryIndex = restaurant.menu.findIndex(item => item._id.toString() === categoryId);
    if (categoryIndex === -1) throw new HttpException(409, 'Category Does not exists');

    const removeData = restaurant.menu.splice(categoryIndex, 1);
    await restaurant.save();

    const data: CommonResponse<MenuType> = { statusCode: 200, data: removeData[0], message: 'Category deleted' };
    return data;
  }
}
