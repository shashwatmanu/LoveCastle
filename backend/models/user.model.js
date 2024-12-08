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
    profilePictures: {
        type: [
          {
            url: { type: String, required: true }, 
            public_id: { type: String, required: true }, 
          }
        ],
        validate: [arrayLimit, "Exceeds the limit of 3 images"], 
        default: [],
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
    //   gameMode: { type: [String], default: ['Casual'] },
      locationPreference: { type: Boolean, default: false },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [0, 0], // Default coordinates (longitude, latitude)
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Banned'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
    return val.length <= 3; // Limits the array to a maximum of 3 items
  }
  
// Add a 2dsphere index for location-based queries
UserSchema.index({ location: '2dsphere' });

export default mongoose.model('User', UserSchema);
