import { Document } from 'mongoose';

export interface Order {
  _id?: string;
  userId: string;
  restaurantId: string;
  categoryId: string;
  foodId: string;
  quantity: number;
  deliveryMode: string;
  paymentMode: string;
  totalPayment: number;
  shippingAddress: string;
  orderStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}
