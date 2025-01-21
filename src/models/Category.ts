import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User model
  category: string;
}

const CategorySchema = new Schema<CategoryDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
});

export default mongoose.model<CategoryDocument>("Category", CategorySchema);
