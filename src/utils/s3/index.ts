import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '@/config';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class AwsS3 {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async getPreSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const getParams = {
        Bucket: bucket,
        Key: key,
      };
      const getCommand = new GetObjectCommand(getParams);

      const url: string = await getSignedUrl(this.s3Client, getCommand, { expiresIn: expiresIn });
      return url;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async uploadBase64Image(bucket: string, key: string, base64Image: string) {
    try {
      const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: buffer,
      };
      const uploadCommad = new PutObjectCommand(uploadParams);

      await this.s3Client.send(uploadCommad);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async deleteObject(bucket: string, key: string) {
    try {
      const deleteParams = {
        Bucket: bucket,
        Key: key,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);

      await this.s3Client.send(deleteCommand);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
