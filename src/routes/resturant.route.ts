import { RestaurantController } from '@/controllers/restaurant.controller';
import { CategoryQueryDto, IdParamDto } from '@/dtos/restaurant.dto';
import { BodyAuthMiddleware, UserVerificationMiddleware } from '@/middlewares/auth.middleware';
import { ParamsValidationMiddelware, QueryValidationMiddelware } from '@/middlewares/validation.middleware';
import { Router } from 'express';

export class RestaurantRoute {
  public path = '/web/restaurant';
  public router = Router();
  public controller = new RestaurantController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, BodyAuthMiddleware, this.controller.createRestaurant);
    this.router.get(`${this.path}/`, UserVerificationMiddleware, this.controller.getAllRestaurants);
    this.router.get(`${this.path}/:id`, UserVerificationMiddleware, this.controller.getRestaurantById);
    this.router.put(`${this.path}/add-menu-type`, UserVerificationMiddleware, this.controller.addMenuType);
    this.router.put(`${this.path}/add-menu-item`, UserVerificationMiddleware, this.controller.addMenuItem);

    //this route contains :id with query ?category=
    this.router.get(
      `${this.path}/food/:id`,
      UserVerificationMiddleware,
      ParamsValidationMiddelware(IdParamDto),
      QueryValidationMiddelware(CategoryQueryDto),
      this.controller.getFoodById,
    );
  }
}
