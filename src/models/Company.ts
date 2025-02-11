import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";

export interface CompanyDocument extends Document {
  name: string;
  website?: string;
  mailingAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  fax?: string;
  timeZone?: string;
  senderName?: string;
  senderEmail?: string;
  companyNamePayable?: string;
  admin: UserDocument["_id"];
  teamMembers: UserDocument["_id"][];
  bureauAddresses : {
    Equifax : {
      name : string,
      street : string,
      state : string,
      city : string,
      zip : string
    },
    Experian : {
      name : string,
      street : string,
      state : string,
      city : string,
      zip : string
    },
    TransUnion : {
      name : string,
      street : string,
      state : string,
      city : string,
      zip : string
    },
  }
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
  admin: { type: Schema.Types.ObjectId, ref: "user", required: true },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: "user" }],
  bureauAddresses : {
    Equifax : {
      name : { type: String, required: true, default : "Equifax" },
      street : { type: String, default : "10"},
      state : { type: String, default : "Florida"},
      city : { type: String, default : "Alarado"},
      zip : { type: String, default : "47040"}
    },
    Experian : {
      name : { type: String, required: true , default : "Experian"},
      street : { type: String, default : "10"},
      state : { type: String, default : "Florida"},
      city : { type: String, default : "Alarado"},
      zip : { type: String, default : "47040"}
    },
    TransUnion : {
      name : { type: String, required: true, default : 'TransUnion' },
      street : { type: String, default : "10"},
      state : { type: String, default : "Florida"},
      city : { type: String, default : "Alarado"},
      zip : { type: String, default : "47040"}
    },
  }
});

export default mongoose.model<CompanyDocument>("Company", CompanySchema);
