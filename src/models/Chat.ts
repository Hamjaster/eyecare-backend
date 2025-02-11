// models/Chat.ts
import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";
import { ClientDocument } from "./Client";

export type ParticipantType = "user" | "client";

export interface Participant {
  type: ParticipantType;
  refId: mongoose.Types.ObjectId;
}

export interface ChatDocument extends Document {
  participants: Participant[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
  unread : number;
}

const ChatSchema = new Schema({
  participants: [{
    type: { type: String, enum: ["user", "client"], required: true },
    refId: { type: Schema.Types.ObjectId, required: true, refPath: 'participants.type' }
  }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  unread: { type: Number },
  lastMessageTimestamp: { type: Date }
}, { 
  timestamps: true,
  // Ensure unique chat between participants
  index: {
    participants: 1,
    unique: true,
    partialFilterExpression: { 'participants.1': { $exists: true } }
  }
});

export default mongoose.model<ChatDocument>("Chat", ChatSchema);