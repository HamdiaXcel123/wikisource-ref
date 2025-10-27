import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  // Notification preferences
  notifications: {
    email: {
      enabled: { type: Boolean, default: true },
      submissionApproved: { type: Boolean, default: true },
      submissionRejected: { type: Boolean, default: true },
      badgeEarned: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true }
    },
    push: {
      enabled: { type: Boolean, default: false },
      submissionApproved: { type: Boolean, default: true },
      submissionRejected: { type: Boolean, default: true },
      badgeEarned: { type: Boolean, default: true }
    },
    inApp: {
      enabled: { type: Boolean, default: true },
      submissionApproved: { type: Boolean, default: true },
      submissionRejected: { type: Boolean, default: true },
      badgeEarned: { type: Boolean, default: true },
      verificationRequest: { type: Boolean, default: true }
    }
  },
  // Privacy settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'community', 'private'],
      default: 'public'
    },
    showEmail: { type: Boolean, default: false },
    showCountry: { type: Boolean, default: true },
    showBadges: { type: Boolean, default: true },
    showActivity: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true }
  },
  // Display preferences
  display: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    },
    itemsPerPage: {
      type: Number,
      default: 20,
      min: 10,
      max: 100
    },
    compactMode: { type: Boolean, default: false }
  },
  // Account preferences
  account: {
    twoFactorEnabled: { type: Boolean, default: false },
    sessionTimeout: {
      type: Number,
      default: 30,
      min: 5,
      max: 1440
    },
    autoLogout: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;
