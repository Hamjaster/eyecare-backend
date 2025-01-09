import mongoose, { Schema, Document } from "mongoose";

export interface InstructionDocument extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User model
  instruction: string;
}

const InstructionSchema = new Schema<InstructionDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  instruction: { type: String, required: true },
});

export default mongoose.model<InstructionDocument>("Instruction", InstructionSchema);
