import { AWS_MAIN_BUCKET } from '@/config';
import { HttpException } from '@/exceptions/httpException';
import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdNameResponse, IdResponse } from '@/interfaces/commonResponse.interface';
import { AddMenuBody, MenuCategoryItems, MenuType, RestaurantType } from '@/interfaces/restaurant.interface';
import { RestaurantModel } from '@/models/restaurant.model';
import { AwsS3 } from '@/utils/s3';
import { setHeapSnapshotNearHeapLimit } from 'v8';

export class RestaurantService {
  public async createRestaurant(userData: RestaurantType): Promise<CommonResponse<RestaurantType>> {
    const base64Image: string = userData.imageUrl;
    const imagePath: string = `restaurants/image-${Date.now()}.jpeg`;

    const s3 = new AwsS3();
    await s3.uploadBase64Image(AWS_MAIN_BUCKET, imagePath, base64Image);
    userData.imageUrl = imagePath;

    const createData = await RestaurantModel.create(userData);

    const response: CommonResponse<RestaurantType> = { statusCode: 201, data: createData, message: 'restaurant created' };
    return response;
  }

  public async getAllRestaurants(): Promise<CommonResponse<RestaurantType[]>> {
    const findOne = await RestaurantModel.find();

    const s3 = new AwsS3();

    const addImageUrl = await Promise.all(
      findOne.map(async item => {
        const imageUrl = await s3.getPreSignedUrl(AWS_MAIN_BUCKET, item.imageUrl, 3600);
        item.imageUrl = imageUrl;
        return item;
      }),
    );

    const data: RestaurantType[] = addImageUrl;

    const responseData: CommonResponse<RestaurantType[]> = { statusCode: 200, data: data, message: 'restaurant data' };
    return responseData;
  }

  public async getRestaurantById(restaurantId: string): Promise<CommonResponse<RestaurantType>> {
    const findOne = await RestaurantModel.findOne({ _id: restaurantId });

    const s3 = new AwsS3();

    const restaurantImageUrl = findOne.imageUrl;
    const signedUrl = await s3.getPreSignedUrl(AWS_MAIN_BUCKET, restaurantImageUrl, 3600);
    findOne.imageUrl = signedUrl;

    for (const loop1 in findOne?.menu) {
      const foods = findOne?.menu[loop1].items;

      for (const loop2 in foods) {
        const foodImageUrl = foods[loop2].imageUrl;

        const signedUrl = await s3.getPreSignedUrl(AWS_MAIN_BUCKET, foodImageUrl, 3600);
        foods[loop2].imageUrl = signedUrl;
      }
    }

    const responseData: CommonResponse<RestaurantType> = { statusCode: 200, data: findOne, message: 'restaurant data' };
    return responseData;
  }

  public async updateRestaurantDetails(restaurantId: string, userData: Partial<RestaurantType>): Promise<CommonResponse<IdResponse>> {
    const restaurant = await RestaurantModel.findById(restaurantId);

    const base64Image = userData.imageUrl;
    const imageUrl = restaurant.imageUrl;
    if (base64Image !== undefined && base64Image !== 'null') {
      const s3 = new AwsS3();
      await s3.deleteObject(AWS_MAIN_BUCKET, imageUrl);

      const imagePath = `restaurants/image-${Date.now()}.jpeg`;
      await s3.uploadBase64Image(AWS_MAIN_BUCKET, imagePath, base64Image);

      console.log(true);

      userData.imageUrl = imagePath;
    } else {
      userData.imageUrl = imageUrl;
    }

    Object.assign(restaurant, userData);
    await restaurant.save();

    const response: CommonResponse<IdResponse> = { statusCode: 200, data: { _id: restaurant._id }, message: 'restaurant updated' };
    return response;
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
    const findData = await RestaurantModel.findOne({ _id: userId });
    if (!findData) throw new HttpException(409, 'This restaurant not exists');

    const base64Image: string = userData.item.imageUrl;
    const imagePath: string = `restaurants/image-${Date.now()}.jpeg`;

    const s3 = new AwsS3();
    s3.uploadBase64Image(AWS_MAIN_BUCKET, imagePath, base64Image);
    userData.item.imageUrl = imagePath;

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

    const s3 = new AwsS3();

    for (const i in findRestaurant?.menu) {
      const menuItem = findRestaurant?.menu[i];
      for (const x in menuItem.items) {
        const imageUrl = menuItem?.items[x].imageUrl;

        const signedUrl = await s3.getPreSignedUrl(AWS_MAIN_BUCKET, imageUrl, 3600);
        menuItem.items[x].imageUrl = signedUrl;
      }
    }

    const menuData: MenuType[] = findRestaurant.menu;

    const data: CommonResponse<MenuType[]> = { statusCode: 200, data: menuData, message: 'Menu items fetched' };
    return data;
  }

  public async getFoodById(foodId: string, restaurantId: string, category: string): Promise<CommonResponse<MenuCategoryItems>> {
    const findFoodData = await RestaurantModel.findById(restaurantId);

    if (!findFoodData) throw new HttpException(409, 'Restaurant does not exists');

    const categoryIndex: number = findFoodData.menu.findIndex(item => item.category === category);
    if (categoryIndex === -1) throw new HttpException(409, 'Category does not exists');

    const foodData = findFoodData.menu[categoryIndex].items.find(food => food._id.toString() === foodId);
    if (!foodData) throw new HttpException(409, 'Food Does not exists');

    const s3 = new AwsS3();
    const imageUrl = foodData.imageUrl;
    const signedUrl = await s3.getPreSignedUrl(AWS_MAIN_BUCKET, imageUrl, 3600);
    foodData.imageUrl = signedUrl;

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

    if (item.imageUrl !== 'null') {
      const s3 = new AwsS3();
      const imageUrl = category.items[foodIndex].imageUrl;
      await s3.deleteObject(AWS_MAIN_BUCKET, imageUrl);

      const base64Image = item.imageUrl;
      const imagePath = `restaurants/image-${Date.now()}.jpeg`;
      await s3.uploadBase64Image(AWS_MAIN_BUCKET, imagePath, base64Image);

      item.imageUrl = imagePath;
    } else {
      item.imageUrl = category.items[foodIndex].imageUrl;
    }

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
