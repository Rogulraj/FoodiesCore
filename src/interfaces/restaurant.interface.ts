export interface MenuTypeItem {
  _id?: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  ingredients: string;
  nutritions: string;
}

export interface MenuType {
  [key: string]: MenuTypeItem[];
}

export interface RestaurantType {
  _id?: string;
  name: string;
  imageUrl: string;
  deliveryDuration: string;
  minOrderVal: number;
  tags: string[];
  menuType: MenuType;
}

export interface AddMenuBody {
  type: string;
  item?: MenuTypeItem;
}

// export interface AddMenuItemBody extends MenuTypeItem {
//   type: string;
// }
