export interface PersonalUserAddress {
  _id?: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
}

export interface PersonalUserCardDetail {
  _id?: string;
  cardNumber: number;
  cardHolderName: string;
  expires: string;
  cvvOrCvc: number;
}

export interface PersonalUserDetails {
  _id?: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  address: PersonalUserAddress[];
  cardDetails: PersonalUserCardDetail[];
}
