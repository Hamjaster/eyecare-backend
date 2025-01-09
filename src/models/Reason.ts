import mongoose, { Schema, Document } from "mongoose";

export interface ReasonDocument extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User model
  reason: string;
}

const ReasonSchema = new Schema<ReasonDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
});

export default mongoose.model<ReasonDocument>("Reason", ReasonSchema);
