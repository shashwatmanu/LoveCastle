import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true }, // Unique game ID
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // Links game to match
  whitePlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blackPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isDraw: { type: Boolean, default: false },
  moves: { type: String, default: "" }, // PGN moves
  timestamp: { type: Date, default: Date.now }
});

const matchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  icebreakerGameStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  isChatEnabled: { type: Boolean, default: false },
  games: [gameSchema],
  currentGame: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', default: null }, // Track ongoing game
  user1Wins: { type: Number, default: 0 },
  user2Wins: { type: Number, default: 0 },
  totalGamesPlayed: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
