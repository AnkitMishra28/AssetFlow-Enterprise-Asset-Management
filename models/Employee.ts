import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  department: mongoose.Types.ObjectId;
  role: "Employee" | "Department Head" | "Asset Manager";
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Employee Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format."],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department reference is required."],
    },
    role: {
      type: String,
      enum: ["Employee", "Department Head", "Asset Manager"],
      required: [true, "Role is required."],
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

const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);
export default Employee;
