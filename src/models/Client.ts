import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";

export interface ClientDocument extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  last4SSN: string;
  dateOfBirth: Date;
  mailingAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  phoneMobile: string;
  phoneAlternate?: string;
  fax?: string;
  status: string;
  startDate: Date;
  assignedTo: UserDocument;
  referredBy: UserDocument;
  onBoardedBy: UserDocument;
}

const ClientSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  last4SSN: { type: String },
  dateOfBirth: { type: Date },
  mailingAddress: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  phoneMobile: { type: String },
  phoneAlternate: { type: String },
  fax: { type: String },
  status: { type: String },
  startDate: { type: Date },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "User" },
  onBoardedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<ClientDocument>("Client", ClientSchema);
