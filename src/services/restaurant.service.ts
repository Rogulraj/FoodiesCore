import { HttpException } from '@/exceptions/httpException';
import { StoreBase64Image } from '@/helpers/base64.helper';
import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdNameResponse } from '@/interfaces/commonResponse.interface';
import { AddMenuBody, RestaurantType } from '@/interfaces/restaurant.interface';
import { RestaurantModel } from '@/models/restaurant.model';

export class RestaurantService {
  public async createRestaurant(userData: RestaurantType): Promise<CommonResponse<RestaurantType>> {
    // store base64 image in db
    const imagePath = await StoreBase64Image(userData.imageUrl);
    if (!imagePath) throw new HttpException(500, 'Image Not store in db.');
    userData.imageUrl = imagePath;

    const createData = await (await RestaurantModel.create(userData)).populate('_id');

    const response: CommonResponse<RestaurantType> = { statusCode: 201, data: createData, message: 'restaurant created' };

    return response;
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
}
