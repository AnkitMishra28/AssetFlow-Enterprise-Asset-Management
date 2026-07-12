import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  warrantyPeriod: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name is required."],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    warrantyPeriod: {
      type: Number,
      required: [true, "Warranty Period is required."],
      min: [1, "Warranty Period must be a positive integer."],
      validate: {
        validator: Number.isInteger,
        message: "Warranty Period must be an integer."
      }
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
