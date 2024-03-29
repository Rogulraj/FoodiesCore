import { MenuType, MenuCategoryItems, RestaurantType } from '@/interfaces/restaurant.interface';
import { Document, Schema, model } from 'mongoose';

// MenuCategorySchema
const MenuCategorySchema = new Schema<MenuCategoryItems>({
  name: { type: String },
  imageUrl: { type: String },
  price: { type: Number },
  description: { type: String },
  ingredients: { type: String },
  nutritions: { type: String },
});

const MenuSchema = new Schema<MenuType>({
  category: { type: String, required: true },
  items: { type: [MenuCategorySchema], required: true },
});

// RestaurantSchema
const RestaurantSchema = new Schema<RestaurantType>({
  _id: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  imageUrl: { type: String },
  deliveryDuration: { type: String, required: true },
  minOrderVal: { type: Number, required: true },
  tags: { type: [String], required: true },
  menu: { type: [MenuSchema], required: true },
});

export const RestaurantModel = model<RestaurantType & Document>('Restaurant', RestaurantSchema);
