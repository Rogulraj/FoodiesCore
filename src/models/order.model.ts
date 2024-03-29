import { Order } from '@/interfaces/order.interface';
import { Document, Schema, model } from 'mongoose';

const OrderSchema = new Schema<Order>({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  categoryId: { type: String, required: true },
  foodId: { type: String, required: true },
  quantity: { type: Number, required: true },
  deliveryMode: { type: String, required: true },
  paymentMode: { type: String, required: true },
  totalPayment: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  orderStatus: { type: String, required: true },
});

export const OrderModel = model<Order & Document>('Order', OrderSchema);
