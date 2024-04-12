import { RequestWithId } from '@/interfaces/auth.interface';
import { CommonResponse, IdResponse } from '@/interfaces/commonResponse.interface';
import { PersonalUserDetails } from '@/interfaces/personalUserDetails';
import { PersonalUserDetailsService } from '@/services/personalUserDetails.service';
import { NextFunction, Request, Response } from 'express';

export class PersonalUserDetailController {
  private service = new PersonalUserDetailsService();

  public createUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: PersonalUserDetails = req.body;

      const createData: CommonResponse<IdResponse> = await this.service.createUserDetails(userData);
      res.status(createData.statusCode).json(createData);
    } catch (error) {
      next(error);
    }
  };

  public getUserDetailsById = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const userDetails = await this.service.getUserDetailsById(userId);

      res.status(userDetails.statusCode).json(userDetails);
    } catch (error) {
      next(error);
    }
  };

  public updateUserDetailsById = async (req: RequestWithId, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: PersonalUserDetails = req.body;
      const updateDetails: CommonResponse<IdResponse> = await this.service.updateUserDetailsById(userId, userData);

      res.status(updateDetails.statusCode).json(updateDetails);
    } catch (error) {
      next(error);
    }
  };
}
