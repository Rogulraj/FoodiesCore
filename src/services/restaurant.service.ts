import { HttpException } from '@/exceptions/httpException';
import { StoreBase64Image } from '@/helpers/base64.helper';
import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdNameResponse } from '@/interfaces/commonResponse.interface';
import { AddMenuBody, MenuTypeItem, RestaurantType } from '@/interfaces/restaurant.interface';
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

  public async addMenuType(userId: RequestWithId['_id'], userData: AddMenuBody): Promise<CommonResponse<IdNameResponse>> {
    const findData = await RestaurantModel.findOne({ _id: userId });
    const type = userData.type;

    if (findData.menuType.has(type)) throw new HttpException(409, `This type ${userData.type} already exists`);

    findData.menuType.set(type, []);
    const update: RestaurantType = await findData.save();

    const response: CommonResponse<IdNameResponse> = { statusCode: 200, data: { _id: update._id, name: update.name }, message: 'menu type added' };
    return response;
  }

  public async addMenuItem(userId: RequestWithId['_id'], userData: AddMenuBody): Promise<CommonResponse<IdNameResponse>> {
    // store base64 image in db
    const imagePath = await StoreBase64Image(userData.item.imageUrl);
    if (!imagePath) throw new HttpException(500, 'Image Not store in db.');
    userData.item.imageUrl = imagePath;

    const findData = await RestaurantModel.findOne({ _id: userId });
    const type = userData.type;
    const item = userData.item;

    if (!findData.menuType.has(type)) throw new HttpException(409, `This type ${userData.type} does not exists`);

    const menuItems = findData.menuType.get(type);
    menuItems.push(item);

    const update = await findData.save();

    const response: CommonResponse<IdNameResponse> = { statusCode: 200, data: { _id: update._id, name: update.name }, message: 'menu item added' };
    return response;
  }

  public async getFoodById(foodId: string, restaurantId: string, category: string): Promise<CommonResponse<MenuTypeItem>> {
    const findFoodData: MenuTypeItem[] = await (await RestaurantModel.findById(restaurantId)).menuType.get(category);
    const foodData: MenuTypeItem = findFoodData.find(item => item._id === foodId);

    const response: CommonResponse<MenuTypeItem> = { statusCode: 200, data: foodData, message: 'food data fetched.' };

    return response;
  }
}
