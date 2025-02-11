import mongoose, { Schema, Document } from "mongoose";
import { RoleDocument } from "./Role";
import { CompanyDocument } from "./Company";
import { features } from "process";
import { ReasonDocument } from "./Reason";
import { InstructionDocument } from "./Instruction";

interface BillingDetails {
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
}

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  billingDetails: BillingDetails;
  selectedSubscriptionPlan: SubscriptionPlan;
  role: RoleDocument; // Reference to a Role
  company: CompanyDocument; // Reference to a Company
  profilePhoto: string;
  reasons: ReasonDocument[];
  instructions: InstructionDocument[];
}
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  billingDetails: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
  },
  selectedSubscriptionPlan: {
    name: { type: String },
    price: { type: Number },
    features: { type: Array },
  },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  profilePhoto: { type: String },
  reasons: [{ type: Schema.Types.ObjectId, ref: "Reason" }],
  instructions: [{ type: Schema.Types.ObjectId, ref: "Instruction" }],
});

export default mongoose.model<UserDocument>("user", UserSchema);
