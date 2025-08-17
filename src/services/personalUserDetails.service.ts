import { CommonResponse, IdResponse } from '@/interfaces/commonResponse.interface';
import { PersonalUserDetails } from '@/interfaces/personalUserDetails';
import { PersonalUserDetailsModel } from '@/models/personalUserDetails.model';
import appConfig from '@/config';
import { supabaseClient } from '@/utils/supabase';
import { HttpException } from '@/exceptions/httpException';

export class PersonalUserDetailsService {
  public async createUserDetails(
    userData: PersonalUserDetails
  ): Promise<CommonResponse<IdResponse>> {
    try {
      const createData = await PersonalUserDetailsModel.create(userData);
    
      return {
        statusCode: 201,
        data: { _id: createData._id },
        message: 'user details created',
      };
    } catch (error) {
      throw new HttpException(500, 'createUserDetails: ' + error);
    }
  }

  public async getUserDetailsById(userId: string): Promise<CommonResponse<PersonalUserDetails>> {
    const userDetails = await PersonalUserDetailsModel.findById(userId);
    if (!userDetails) {
      return {
        statusCode: 404,
        data: null,
        message: 'user not found',
      };
    }

    const response: CommonResponse<PersonalUserDetails> = {
      statusCode: 200,
      data: userDetails,
      message: 'user details fetched',
    };

    return response;
  }

  public async updateUserDetailsById(
    userId: string,
    userData: PersonalUserDetails
  ): Promise<CommonResponse<IdResponse>> {
    const userDetails = await PersonalUserDetailsModel.findById(userId);
  
    if (!userDetails) {
      return {
        statusCode: 404,
        data: null,
        message: 'user not found',
      };
    }
  
    // merge and save
    Object.assign(userDetails, userData);
    await userDetails.save();
  
    const response: CommonResponse<IdResponse> = {
      statusCode: 200,
      data: userDetails._id,
      message: 'user details updated',
    };
  
    return response;
  }  
}
