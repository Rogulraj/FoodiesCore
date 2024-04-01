import { AWS_MAIN_BUCKET } from '@/config';
import { CommonResponse, IdResponse } from '@/interfaces/commonResponse.interface';
import { PersonalUserDetails } from '@/interfaces/personalUserDetails';
import { PersonalUserDetailsModel } from '@/models/personalUserDetails.model';
import { AwsS3 } from '@/utils/s3';

export class PersonalUserDetailsService {
  public async createUserDetails(userData: PersonalUserDetails): Promise<CommonResponse<IdResponse>> {
    const base64Image: string = userData.imageUrl;
    const imagePath: string = `users/image-${Date.now()}.jpeg`;
    if (base64Image !== undefined && base64Image !== 'null') {
      const s3 = new AwsS3();
      await s3.uploadBase64Image(AWS_MAIN_BUCKET, imagePath, base64Image);
      userData.imageUrl = imagePath;
    }

    const createData = await PersonalUserDetailsModel.create(userData);

    return { statusCode: 201, data: { _id: createData._id }, message: 'user details created' };
  }

  public async getUserDetailsById(userId: string): Promise<CommonResponse<PersonalUserDetails>> {
    const userDetails = await PersonalUserDetailsModel.findById(userId);

    const s3 = new AwsS3();
    const signedUrl = await s3.getPreSignedUrl(AWS_MAIN_BUCKET, userDetails.imageUrl, 3600);
    userDetails.imageUrl = signedUrl;

    const data: CommonResponse<PersonalUserDetails> = { statusCode: 200, data: userDetails, message: 'user details fetched' };
    return data;
  }
}
