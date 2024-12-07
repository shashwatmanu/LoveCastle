import mongoose from "mongoose";

// Define the User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // URL to the profile picture
      default: 'default-profile-picture-url.png',
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    chessStats: {
      rating: { type: Number, default: 1200 },
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      favoriteOpening: { type: String, default: '' },
    },
    preferences: {
      ageRange: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 99 },
      },
      genderPreference: { type: String, default: 'Any' },
      chessSkillRange: {
        min: { type: Number, default: 800 },
        max: { type: Number, default: 3000 },
      },
      gameMode: { type: [String], default: ['Casual'] },
      locationPreference: { type: Boolean, default: false },
    },
    location: {
      type: {
        type: String, // GeoJSON type
        enum: ['Point'], // Only allow 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedIn: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Banned'],
      default: 'Active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Add a 2dsphere index for location-based queries
UserSchema.index({ location: '2dsphere' });

export default mongoose.model('User', UserSchema);
