import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "Asset Allocated" | "Asset Returned" | "Transfer Approved" | "Transfer Rejected" | "Overdue Allocation" | "Maintenance Due";
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Asset Allocated", "Asset Returned", "Transfer Approved", "Transfer Rejected", "Overdue Allocation", "Maintenance Due"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
