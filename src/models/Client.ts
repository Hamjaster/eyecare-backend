import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";
import { CreditReport } from "../config/config";

export interface ClientDocument extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  profilePhoto?: string;
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
  signature : {text:string, font : string, image : string};
  photoId ?: string;
  proofOfAddress ?: string;
  tasks : string[],
  note : string,
  creditReport ?: CreditReport;
}



const ClientSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  signature : {
    text : {type : String},
    font : {type : String},
    image : {type : String}
  },
  photoId : {type : String},
  profilePhoto : {type : String},
  proofOfAddress : {type : String},
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
  assignedTo: { type: Schema.Types.ObjectId, ref: "user", required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "user" },
  onBoardedBy: { type: Schema.Types.ObjectId, ref: "user" },
  tasks : {type : Array},
  note : {type : String},
  creditReport : {
    type: {
      accounts: { type: Array },
      creditScores: { type: Array },
      creditDetails: { type: Object }
    },
    default: null // Set default value to null
      
  }
});

export default mongoose.model<ClientDocument>("client", ClientSchema);
