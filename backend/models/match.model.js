import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    gameId: { type: String, required: true }, // Unique identifier for each game
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Winner's ID
    loser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Loser's ID
    isDraw: { type: Boolean, default: false }, // Indicates if the game was a draw
    moves: { type: String }, // Optional: Stores game moves in PGN or FEN format
    timestamp: { type: Date, default: Date.now }, // When the game was played
  });
  
  const matchSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    icebreakerGameStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    isChatEnabled: { type: Boolean, default: false }, // Indicates if chat is unlocked
    games: [gameSchema], // Array to store details of all games played in the match
    user1Wins: { type: Number, default: 0 }, // Number of games won by user1
    user2Wins: { type: Number, default: 0 }, // Number of games won by user2
    totalGamesPlayed: { type: Number, default: 0 }, // Total number of games played
  }, { timestamps: true });
  
  export default mongoose.model('Match', matchSchema);
  
