import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";

export interface LetterTemplateDocument extends Document {
  title: string;
  content: string; // The template's HTML or text content with placeholders
  category?: string; // Optional category for organizing templates
  status : string;
  user: UserDocument; // Reference to the user who created the template
  isDefaultTemplate : boolean
  letterTemplate : string;
  createdAt: Date;
  updatedAt: Date;
}

const LetterTemplateSchema = new Schema<LetterTemplateDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    status: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    letterTemplate : {type : String},
    isDefaultTemplate : {type : Boolean, default : true}
  },
  { timestamps: true }
);


export default mongoose.model<LetterTemplateDocument>(
  "LetterTemplate",
  LetterTemplateSchema
);
