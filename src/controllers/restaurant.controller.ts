import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdNameResponse } from '@/interfaces/commonResponse.interface';
import { AddMenuBody, RestaurantType } from '@/interfaces/restaurant.interface';
import { RestaurantService } from '@/services/restaurant.service';
import { NextFunction, Response } from 'express';

export class RestaurantController {
  public service = new RestaurantService();

  public createRestaurant = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const userId: RequestWithId['_id'] = req._id;

      console.log('userData = ', req.body);

      const userData: RestaurantType = {
        _id: userId,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        menuType: req.body.menuType || {},
      };

      const createRestaurantData: CommonResponse<RestaurantType> = await this.service.createRestaurant(userData);

      res.status(createRestaurantData.statusCode).json(createRestaurantData);
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
}
