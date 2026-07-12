import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistoryEntry {
  type: "Registration" | "Allocation" | "Maintenance" | "Audit" | "StatusChange";
  date: Date;
  details: string;
  actor: string;
}

export interface IAsset extends Document {
  assetTag: string;
  name: string;
  category: mongoose.Types.ObjectId;
  serialNumber: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  condition: "New" | "Good" | "Fair" | "Poor";
  location: string;
  status: "Available" | "Allocated" | "Reserved" | "Under Maintenance" | "Lost" | "Retired" | "Disposed";
  sharedBookable: boolean;
  history: IHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HistoryEntrySchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["Registration", "Allocation", "Maintenance", "Audit", "StatusChange"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    required: true,
  },
  actor: {
    type: String,
    required: true,
  }
}, { _id: false });

const AssetSchema: Schema = new Schema(
  {
    assetTag: {
      type: String,
      required: [true, "Asset Tag is required."],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Asset Name is required."],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required."],
    },
    serialNumber: {
      type: String,
      required: [true, "Serial Number is required."],
      unique: true,
      trim: true,
    },
    acquisitionDate: {
      type: Date,
      required: [true, "Acquisition Date is required."],
    },
    acquisitionCost: {
      type: Number,
      required: [true, "Acquisition Cost is required."],
      min: [0, "Acquisition Cost must be a positive number."],
    },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
      default: "Good",
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"],
      default: "Available",
    },
    sharedBookable: {
      type: Boolean,
      default: false,
    },
    history: {
      type: [HistoryEntrySchema],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
AssetSchema.index({ assetTag: 1 }, { unique: true });
AssetSchema.index({ serialNumber: 1 }, { unique: true });

const Asset: Model<IAsset> = mongoose.models.Asset || mongoose.model<IAsset>("Asset", AssetSchema);
export default Asset;
