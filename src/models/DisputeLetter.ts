import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";

export interface DisputeLetter extends Document {
  title: string; // New field
  category: string; // New field
  status: string; // New field
  description: string;
  bureau : string;
  createdAt : Date;
  user : UserDocument;
  document ?: any
  isDisputeLetter : boolean;
}

const DisputeLetterSchema = new Schema<DisputeLetter>({
  title: { type: String, required: true }, // New field
  category: { type: String }, // New field
  status: { type: String, required: true }, // New field
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bureau : {type : String},
  createdAt : {type : Date, default : new Date()},
  document : {type : Object},
  isDisputeLetter : {type : Boolean, required : true}
});

export default mongoose.model<DisputeLetter>(
  "DisputeLetter",
  DisputeLetterSchema
);
