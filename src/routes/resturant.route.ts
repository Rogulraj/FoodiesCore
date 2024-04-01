import { RestaurantController } from '@/controllers/restaurant.controller';
import { CategoryQueryDto, CategoryRestaurantIdDto, IdParamDto, UpdateFoodItemDto } from '@/dtos/restaurant.dto';
import { BodyAuthMiddleware, UserVerificationMiddleware } from '@/middlewares/auth.middleware';
import { BodyValidationMiddleware, ParamsValidationMiddelware, QueryValidationMiddelware } from '@/middlewares/validation.middleware';
import { Router } from 'express';

export class RestaurantRoute {
  public path = '/web/restaurant';
  public router = Router();
  public controller = new RestaurantController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /** GET */
    // Get all menu items
    this.router.get(`${this.path}/menu-items`, UserVerificationMiddleware, this.controller.getAllMenuItems);
    this.router.get(`${this.path}/:id`, UserVerificationMiddleware, this.controller.getRestaurantById);
    this.router.get(`${this.path}/`, UserVerificationMiddleware, this.controller.getAllRestaurants);

    //this route contains :id with query ?category=
    this.router.get(
      `${this.path}/food/:id`,
      UserVerificationMiddleware,
      ParamsValidationMiddelware(IdParamDto),
      QueryValidationMiddelware(CategoryQueryDto),
      this.controller.getFoodById,
    );

    /** POST */
    this.router.post(`${this.path}/create`, BodyAuthMiddleware, this.controller.createRestaurant);

    /** PUT */
    this.router.put(`${this.path}/update`, UserVerificationMiddleware, this.controller.updateRestaurantDetails);
    this.router.put(`${this.path}/add-menu-category`, UserVerificationMiddleware, this.controller.addMenuCategory);
    this.router.put(`${this.path}/add-menu-item`, UserVerificationMiddleware, this.controller.addMenuItem);
    this.router.put(
      `${this.path}/food/update/:id`,
      ParamsValidationMiddelware(IdParamDto),
      BodyValidationMiddleware(UpdateFoodItemDto),
      UserVerificationMiddleware,
      this.controller.updateFoodById,
    );

    /** DELETE */
    this.router.delete(
      `${this.path}/food/remove-category/:id`,
      UserVerificationMiddleware,
      ParamsValidationMiddelware(IdParamDto),
      this.controller.removeMenuCategaory,
    );
    this.router.delete(
      `${this.path}/food/remove-food/:id`,
      ParamsValidationMiddelware(IdParamDto),
      BodyValidationMiddleware(CategoryRestaurantIdDto),
      this.controller.removeFoodById,
    );
  }
}
