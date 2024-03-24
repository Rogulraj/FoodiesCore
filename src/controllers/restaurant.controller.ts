import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdNameResponse } from '@/interfaces/commonResponse.interface';
import { AddMenuBody, MenuTypeItem, RestaurantType } from '@/interfaces/restaurant.interface';
import { RestaurantService } from '@/services/restaurant.service';
import { NextFunction, Response, Request } from 'express';

export class RestaurantController {
  public service = new RestaurantService();

  public createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: RestaurantType = req.body;

      const createRestaurantData: CommonResponse<RestaurantType> = await this.service.createRestaurant(userData);

      res.status(createRestaurantData.statusCode).json(createRestaurantData);
    } catch (error) {
      next(error);
    }
  };

  public getAllRestaurants = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const restaurantsList: CommonResponse<RestaurantType[]> = await this.service.getAllRestaurants();

      res.status(restaurantsList.statusCode).json(restaurantsList);
    } catch (error) {
      next(error);
    }
  };

  public getRestaurantById = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const { id: restaurantId } = req.params;
      console.log(restaurantId);
      const restaurantData: CommonResponse<RestaurantType> = await this.service.getRestaurantById(restaurantId);

      res.status(restaurantData.statusCode).json(restaurantData);
    } catch (error) {
      next(error);
    }
  };

  public addMenuType = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const userData: AddMenuBody = req.body;
      const userId: RequestWithId['_id'] = req._id;

      const addMenuTypeData: CommonResponse<IdNameResponse> = await this.service.addMenuType(userId, userData);

      res.status(addMenuTypeData.statusCode).json(addMenuTypeData);
    } catch (error) {
      next(error);
    }
  };

  public addMenuItem = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const userData: AddMenuBody = req.body;

      const userId: RequestWithId['_id'] = req._id;

      const addMenuItemData: CommonResponse<IdNameResponse> = await this.service.addMenuItem(userId, userData);

      res.status(addMenuItemData.statusCode).json(addMenuItemData);
    } catch (error) {
      next(error);
    }
  };

  public getFoodById = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const foodId = req.params.id;
      const restaurantId = req.query.restaurantId as string;
      const category = req.query.category as string;

      const foodData: CommonResponse<MenuTypeItem> = await this.service.getFoodById(foodId, restaurantId, category);
      res.status(foodData.statusCode).json(foodData);
    } catch (error) {
      next(error);
    }
  };
}
