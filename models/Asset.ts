import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  assetId: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'],
    default: 'Available',
  },
  allocatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  expectedReturnDate: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
