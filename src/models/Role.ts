import mongoose, { Schema, Document } from "mongoose";
import { UserDocument } from "./User";

interface Permission {
  category: string;
  actions: string[]; // e.g., ["view", "edit", "delete"]
}

export interface RoleDocument extends Document {
  name: string; // e.g., "Co-admin", "Viewer", etc.
  permissions: Permission[];
  user : UserDocument
}

const RoleSchema = new Schema({
  name: { type: String, required: true },
  permissions: [
    {
      category: { type: String, required: true }, // e.g., "Clients & Leads"
      actions: [{ type: String }], // e.g., ["Add", "Delete"]
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  
});


const allPermissions: Permission[] = [
  {
    category: "Clients & Leads",
    actions: [
      "All clients & Leads",
      "Assigned Clients & Leads Only",
      "Delete",
      "Add New Clients & Leads",
    ],
  },
  {
    category: "Letter Library",
    actions: ["Add/Edit/View", "Delete", "View Only"],
  },
  {
    category: "Invoice",
    actions: ["Add/Edit/View", "Delete", "View Only"],
  },
  // Add more categories as needed
]

export const AdminRole = {
  name: "Admin",
  permissions: allPermissions,
};

export default mongoose.model<RoleDocument>("Role", RoleSchema);
