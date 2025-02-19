import mongoose, { Schema, Document } from "mongoose";
import { ClientDocument } from "./Client";
import { UserDocument } from "./User";
import { CompanyDocument } from "./Company";


// Timeline Item Schema
export interface TimelineDocument extends Document {
    user: UserDocument;
    title : string;
    timestamp: Date;
    action: string;
    actionType: string;
    client: ClientDocument;
    company : CompanyDocument
  }
  
  const TimelineItemSchema = new Schema<TimelineDocument>({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    timestamp: { type: Date, default: Date.now },
    action: { type: String },
    actionType: { type: String },
    client: { type: Schema.Types.ObjectId, ref: "client" },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title : {type : String}
  });
  
  const TimelineItem = mongoose.model("TimelineItem", TimelineItemSchema);
  export default TimelineItem;