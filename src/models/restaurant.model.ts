import { MenuTypeItem, RestaurantType } from '@/interfaces/restaurant.interface';
import { Document, Schema, model } from 'mongoose';

// MenuSchema
const MenuSchema = new Schema<MenuTypeItem>({
  name: { type: String },
  imageUrl: { type: String },
  price: { type: Number },
  description: { type: String },
  ingredients: { type: String },
  nutritions: { type: String },
});

// RestaurantSchema
const RestaurantSchema = new Schema<RestaurantType>({
  _id: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  imageUrl: { type: String },
  deliveryDuration: { type: String, required: true },
  minOrderVal: { type: Number, required: true },
  tags: { type: [String], required: true },
  menuType: { type: Map, of: [MenuSchema] },
});

export const RestaurantModel = model<RestaurantType & Document>('Restaurant', RestaurantSchema);
