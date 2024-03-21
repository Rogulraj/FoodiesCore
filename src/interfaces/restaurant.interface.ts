export interface MenuTypeItem {
  name: string;
  imageUrl: string;
  price: string;
  description: string;
  ingredients: string;
  nutritions: string;
}

export interface MenuType {
  [key: string]: MenuTypeItem;
}

export interface RestaurantType {
  _id?: string;
  name: string;
  imageUrl: string;
  menuType: MenuType;
}

export interface AddMenuBody {
  type: string;
  item?: MenuTypeItem;
}

// export interface AddMenuItemBody extends MenuTypeItem {
//   type: string;
// }
