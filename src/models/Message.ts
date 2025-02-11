// models/Message.ts
import mongoose, { Schema, Document } from "mongoose";
import { ChatDocument } from "./Chat";

export interface MessageDocument extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
}

const MessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<MessageDocument>("Message", MessageSchema);