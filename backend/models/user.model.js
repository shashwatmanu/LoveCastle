import mongoose from "mongoose";


const directChallengeSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, default: "" }, // Optional message with the challenge
  createdAt: { type: Date, default: Date.now },
});

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
    name: {
      type: String
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
      gender: { type: String, enum: ["male", "female", "any"], default: "any" },
      chessSkillRange: {
        type: Number,
        default: 200, // Default ±200 ELO range
      },
    //   gameMode: { type: [String], default: ['Casual'] },
      locationPreference: { type: Boolean, default: false },
      maxDistance: {
        type: Number, // Maximum distance in meters for filtering
        default: 50000, // Default to 50 km
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"], // Options for gender
      required: false,
    },
    role: {
      type: String,
      enum: ["free", "premium"],
      default: "free", 
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
    swipedUsers: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
      ref: "User", // Reference to the User collection
      default: [], // Start with no swiped users 
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Banned'],
      default: 'Active',
    },
    dailyUnlocks: {
      challenges: { type: Number, default: 0 }, // Challenges unlocked today
      lastReset: { type: Date, default: null }, // Tracks when unlocks were last reset
    },
    directChallenges: [directChallengeSchema],
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
