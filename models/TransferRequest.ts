import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransferRequest extends Document {
  asset: mongoose.Types.ObjectId;
  fromEmployee: mongoose.Types.ObjectId;
  toEmployee: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransferRequestSchema: Schema = new Schema(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Asset reference is required."],
    },
    fromEmployee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Current employee holder reference is required."],
    },
    toEmployee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Target employee recipient reference is required."],
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Requested by employee reference is required."],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const TransferRequest: Model<ITransferRequest> = mongoose.models.TransferRequest || mongoose.model<ITransferRequest>("TransferRequest", TransferRequestSchema);
export default TransferRequest;
