import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";
import { CategoryDocument } from "./Category";

export interface DisputeLetter extends Document {
  title: string; // New field
  category: CategoryDocument; // New field
  status: string; // New field
  description: string;
  bureau : string;
  attachedDoc : string;
  createdAt : Date;
  user : UserDocument;
  document ?: any
  isDisputeLetter : boolean;
  isPopulatedWithDocs : boolean;
  isPopulatedWithAttachment : boolean;
  round : string;
}

const DisputeLetterSchema = new Schema<DisputeLetter>({
  title: { type: String, required: true }, // New field
  category: { type: Schema.Types.ObjectId, ref: "Category" }, // New field
  status: { type: String, required: true }, // New field
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  bureau : {type : String},
  createdAt : {type : Date, default : new Date()},
  document : {type : Object},
  isPopulatedWithDocs : {type : Boolean, default : false},
  isPopulatedWithAttachment : {type : Boolean, default : false},
  attachedDoc : {type :String},
  isDisputeLetter : {type : Boolean, required : true},
  round : {type : String}
});

export default mongoose.model<DisputeLetter>(
  "DisputeLetter",
  DisputeLetterSchema
);
