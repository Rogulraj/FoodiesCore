import { PersonalUserAddress, PersonalUserCardDetail, PersonalUserDetails } from '@/interfaces/personalUserDetails';
import { Document, Schema, model } from 'mongoose';

const AddressScheme = new Schema<PersonalUserAddress>({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
});

const CardDetailsSchema = new Schema<PersonalUserCardDetail>({
  cardNumber: { type: Number, required: true },
  cardHolderName: { type: String, required: true },
  expires: { type: String, required: true },
  cvvOrCvc: { type: Number, required: true },
});

const PersonalUserDetailsSchema = new Schema<PersonalUserDetails>({
  _id: { type: String, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  address: { type: [AddressScheme] },
  cardDetails: { type: [CardDetailsSchema] },
});

export const PersonalUserDetailsModel = model<PersonalUserDetails & Document>('PersonalUserDetail', PersonalUserDetailsSchema);
