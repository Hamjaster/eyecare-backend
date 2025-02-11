import mongoose, { Schema, Document } from "mongoose";
import { CompanyDocument } from "./Company";
import { UserDocument } from "./User";
import { ClientDocument } from "./Client";

export interface TaskDocument extends Document {
  company: CompanyDocument;
  assignedTo: UserDocument;
  client: ClientDocument;
  category: string;
  dueDate: Date;
  notes: string;
  status: string;
}

const TaskSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "user", required: true },
  client: { type: Schema.Types.ObjectId, ref: "client", required: true },
  category: { 
    type: String
  },
  dueDate: { type: Date, required: true },
  notes: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Completed"] },
});

export default mongoose.model<TaskDocument>("Task", TaskSchema);