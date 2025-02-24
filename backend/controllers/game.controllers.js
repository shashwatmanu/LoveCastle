import Match from "../models/match.model.js";
import { v4 as uuidv4 } from "uuid"; // Generate unique game IDs

// Start a new game in an existing match
export const startNewGame = async (req, res) => {
  try {
    const { matchId } = req.body;
    const match = await Match.findById(matchId);

    if (!match) return res.status(404).json({ error: "Match not found" });

    // Check if there's already an ongoing game
    if (match.currentGame) {
      return res.status(400).json({ error: "A game is already in progress" });
    }

    // Assign colors randomly
    const isUser1White = Math.random() < 0.5;
    const newGame = {
      gameId: uuidv4(),
      matchId: match._id,
      whitePlayer: isUser1White ? match.user1 : match.user2,
      blackPlayer: isUser1White ? match.user2 : match.user1,
      moves: ""
    };

    match.games.push(newGame);
    match.currentGame = newGame.gameId;
    await match.save();

    return res.status(201).json({ message: "New game started", newGame });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update game moves
export const updateGameMoves = async (req, res) => {
  try {
    const { matchId, gameId, move, userId } = req.body;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ error: "Match not found" });

    const game = match.games.find(g => g.gameId === gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    // Ensure it's the user's turn
    const moveCount = game.moves.split(" ").length;
    const isWhiteTurn = moveCount % 2 === 0;
    if ((isWhiteTurn && game.whitePlayer.toString() !== userId) || 
        (!isWhiteTurn && game.blackPlayer.toString() !== userId)) {
      return res.status(403).json({ error: "Not your turn" });
    }

    game.moves += (game.moves ? " " : "") + move;
    await match.save();

    return res.status(200).json({ message: "Move recorded", game });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
