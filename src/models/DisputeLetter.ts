import mongoose, { Schema, Document } from "mongoose";

export interface DisputeLetter extends Document {
  title: string; // New field
  category: string; // New field
  status: string; // New field
  description: string;
  forClient: mongoose.Types.ObjectId;
}

const DisputeLetterSchema = new Schema<DisputeLetter>({
  title: { type: String, required: true }, // New field
  category: { type: String, required: true }, // New field
  status: { type: String, required: true }, // New field
  description: { type: String, required: true },
  forClient: { type: Schema.Types.ObjectId, ref: "Client", required: true },
});

export default mongoose.model<DisputeLetter>(
  "DisputeLetter",
  DisputeLetterSchema
);
