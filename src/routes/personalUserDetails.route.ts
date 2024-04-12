import { PersonalUserDetailController } from '@/controllers/personalUserDetails.controller';
import { IdParamDto } from '@/dtos/restaurant.dto';
import { BodyAuthMiddleware, UserVerificationMiddleware } from '@/middlewares/auth.middleware';
import { ParamsValidationMiddelware } from '@/middlewares/validation.middleware';
import express, { Router } from 'express';

export class PersonalUserDetailRoute {
  public router: Router = express.Router();
  public controller: PersonalUserDetailController = new PersonalUserDetailController();
  public path: string = '/web/personal';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /** POST */
    this.router.post(`${this.path}/user-details/create`, BodyAuthMiddleware, this.controller.createUserDetails);

    /** GET */
    this.router.get(
      `${this.path}/user-details/get/:id`,
      UserVerificationMiddleware,
      ParamsValidationMiddelware(IdParamDto),
      this.controller.getUserDetailsById,
    );

    /** PUT */
    this.router.put(
      `${this.path}/user-details/update/:id`,
      UserVerificationMiddleware,
      ParamsValidationMiddelware(IdParamDto),
      this.controller.updateUserDetailsById,
    );
  }
}
