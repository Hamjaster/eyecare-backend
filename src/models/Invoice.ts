// src/models/Invoice.ts
import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";
import { ClientDocument } from "./Client";

export interface InvoiceDocument extends Document {
  client: ClientDocument;
  invoiceBy: UserDocument;
  referenceNo: string;
  invoiceDate: Date;
  dueDate: Date;
  items: { description: string; price: number }[];
  status: "paid" | "unpaid" | "partial" | "pending";
  total: number;
}

const InvoiceSchema = new Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
    required: true,
  },
  invoiceBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  referenceNo: { type: String },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  items: [
    {
      description: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["paid", "unpaid", "partial", "pending"],
    default: "pending",
  },
  total: { type: Number, required: true },
});

export default mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);
