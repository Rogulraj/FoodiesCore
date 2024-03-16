export interface ReturnResponse<DataType> {
  statusCode: number;
  data: DataType;
  message: string;
}
