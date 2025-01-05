import mongoose, { Schema, Document } from "mongoose";

interface BureauDetails {
  status: "Active" | "Closed" | "Disputed";
  accountName?: string;
  dateReported?: Date;
  lastActivity?: Date;
  amount?: number;
  plaintiff?: string;
  ECOA?: string;
  dateFiled?: Date;
}

export interface DisputeItemDocument extends Document {
  creditBureaus: string[]; // ["Equifax", "Experian", "TransUnion"]
  accountNumber?: string;
  differentAccountNumbers?: {
    Equifax?: string;
    Experian?: string;
    TransUnion?: string;
  };
  creditorFurnisher: string;
  reason: string;
  instruction: string;
  additionalDetails: {
    Equifax?: BureauDetails;
    Experian?: BureauDetails;
    TransUnion?: BureauDetails;
  };
  forClient: mongoose.Types.ObjectId; // Reference to the Client model
}

const BureauDetailsSchema = new Schema<BureauDetails>({
  status: {
    type: String,
    enum: ["Active", "Closed", "Disputed"],
    required: true,
  },
  accountName: { type: String },
  dateReported: { type: Date },
  lastActivity: { type: Date },
  amount: { type: Number },
  plaintiff: { type: String },
  ECOA: { type: String },
  dateFiled: { type: Date },
});

const DisputeItemSchema = new Schema<DisputeItemDocument>({
  creditBureaus: { type: [String], required: true },
  accountNumber: { type: String },
  differentAccountNumbers: {
    Equifax: { type: String },
    Experian: { type: String },
    TransUnion: { type: String },
  },
  creditorFurnisher: { type: String, required: true },
  reason: { type: String, required: true },
  instruction: { type: String, required: true },
  additionalDetails: {
    Equifax: { type: BureauDetailsSchema },
    Experian: { type: BureauDetailsSchema },
    TransUnion: { type: BureauDetailsSchema },
  },
  forClient: { type: Schema.Types.ObjectId, ref: "Client", required: true },
});

const DisputeItem = mongoose.model<DisputeItemDocument>(
  "DisputeItem",
  DisputeItemSchema
);

export default DisputeItem;
