import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'submission_created',
      'submission_verified',
      'badge_earned',
      'role_changed',
      'profile_updated',
      'login',
      'logout'
    ],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });

// Auto-delete old activities after 180 days
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
