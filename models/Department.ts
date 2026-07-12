import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  head: string;
  parentDepartment?: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Department Name is required."],
      unique: true,
      trim: true,
    },
    head: {
      type: String,
      required: [true, "Department Head is required."],
      trim: true,
    },
    parentDepartment: {
      type: String,
      default: "—",
      trim: true,
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

const Department: Model<IDepartment> = mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema);
export default Department;
