import { RestaurantController } from '@/controllers/restaurant.controller';
import { UserVerificationMiddleware } from '@/middlewares/auth.middleware';
import { SetUpMulterWithStorage } from '@/middlewares/multer.middleware';
import { Router } from 'express';
import path from 'path';

export class RestaurantRoute {
  public path = '/web/restaurant';
  public router = Router();
  public controller = new RestaurantController();
  public multer = SetUpMulterWithStorage(path.join(__dirname, '../assets'));

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, UserVerificationMiddleware, this.controller.createRestaurant);
    this.router.put(`${this.path}/add-menu-type`, UserVerificationMiddleware, this.controller.addMenuType);
    this.router.put(`${this.path}/add-menu-item`, UserVerificationMiddleware, this.multer.single('imageUrl'), this.controller.addMenuItem);
  }
}
