import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const GamePage = () => {
  const [game, setGame] = useState(new Chess());
  const [playerColor] = useState("white"); // Assume white for now

  // Function to handle piece movement
  const onDrop = (sourceSquare, targetSquare) => {
    // Ensure the player moves only their own pieces
    if (
      (playerColor === "white" && game.turn() !== "w") ||
      (playerColor === "black" && game.turn() !== "b")
    ) {
      console.log("Not your turn!");
      return false;
    }

    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move) {
      setGame(newGame);
      
      console.log("Move made:", move);
      
      console.log("Game FEN:", newGame.fen());
      return true;
    } else {
      console.log("Invalid move!");
      return false;
    }
  };

  return (
    <div>
      <h2>Chess Game</h2>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={playerColor} // Flip board for black
      />
      
    </div>
  );
};

export default GamePage;
