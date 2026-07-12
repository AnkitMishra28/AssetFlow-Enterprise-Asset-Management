import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAllocation extends Document {
  asset: mongoose.Types.ObjectId;
  employee: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
  allocatedDate: Date;
  expectedReturnDate?: Date;
  returnedDate?: Date;
  conditionOnReturn?: "New" | "Good" | "Fair" | "Poor";
  status: "Active" | "Returned" | "Overdue";
  createdAt: Date;
  updatedAt: Date;
}

const AllocationSchema: Schema = new Schema(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Asset reference is required."],
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee reference is required."],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department reference is required."],
    },
    allocatedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expectedReturnDate: {
      type: Date,
    },
    returnedDate: {
      type: Date,
    },
    conditionOnReturn: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
    },
    status: {
      type: String,
      enum: ["Active", "Returned", "Overdue"],
      default: "Active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Allocation: Model<IAllocation> = mongoose.models.Allocation || mongoose.model<IAllocation>("Allocation", AllocationSchema);
export default Allocation;
