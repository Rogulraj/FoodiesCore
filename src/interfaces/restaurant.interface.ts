export interface MenuCategoryItems {
  _id?: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  ingredients: string;
  nutritions: string;
}

export interface MenuType {
  _id?: string;
  category: string;
  items: MenuCategoryItems[];
}

export interface RestaurantType {
  _id?: string;
  name: string;
  imageUrl: string;
  deliveryDuration: string;
  minOrderVal: number;
  tags: string[];
  menu: MenuType[];
}

export interface AddMenuBody {
  category: string;
  item?: MenuCategoryItems;
}

// export interface AddMenuItemBody extends MenuTypeItem {
//   type: string;
// }
