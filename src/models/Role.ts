import mongoose, { Schema, Document } from "mongoose";

interface Permission {
  category: string;
  actions: string[]; // e.g., ["view", "edit", "delete"]
}

export interface RoleDocument extends Document {
  name: string; // e.g., "Co-admin", "Viewer", etc.
  permissions: Permission[];
}

const RoleSchema = new Schema({
  name: { type: String, required: true },
  permissions: [
    {
      category: { type: String, required: true }, // e.g., "Clients & Leads"
      actions: [{ type: String }], // e.g., ["Add", "Delete"]
    },
  ],
});

export default mongoose.model<RoleDocument>("Role", RoleSchema);
