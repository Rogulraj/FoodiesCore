export interface CommonResponse<DataType> {
  statusCode: number;
  data: DataType;
  message: string;
}
