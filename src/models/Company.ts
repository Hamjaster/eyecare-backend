import mongoose, { Schema, Document } from "mongoose";

export interface CompanyDocument extends Document {
  name: string;
  website: string;
  mailingAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  fax?: string;
  timeZone: string;
  senderName: string;
  senderEmail: string;
  companyNamePayable: string;
  admin: mongoose.Types.ObjectId; // Reference to a User
  teamMembers: mongoose.Types.ObjectId[]; // Array of Users
}

const CompanySchema = new Schema({
  name: { type: String, required: true },
  profilePhoto: { type: String },
  website: { type: String },
  mailingAddress: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
  phone: { type: String },
  fax: { type: String },
  timeZone: { type: String },
  senderName: { type: String },
  senderEmail: { type: String },
  companyNamePayable: { type: String },
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<CompanyDocument>("Company", CompanySchema);
