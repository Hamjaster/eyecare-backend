import mongoose, { Document, Schema } from "mongoose";

export interface CreditorDocument extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  user: mongoose.Types.ObjectId;
  companyName: string;
  accountType: string;
  notes: string;
}

const CreditorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: false },
    companyName: { type: String, required: true },
    accountType: { type: String, required: true },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<CreditorDocument>("Creditor", CreditorSchema);
