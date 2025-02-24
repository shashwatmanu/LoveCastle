import express from "express";
import cors from "cors";
import "dotenv/config.js";
import { Server } from "socket.io"; // Import Socket.IO
import http from "http"; // Import http for server creation
import dbConnect from "./helpers/dbConnect.js";
import authRoute from "./routes/auth.routes.js";
import authenticate from "./middlewares/authenticate.js";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import Match from "./models/match.model.js"; // Import Match model

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

try {
  await dbConnect;
  app.use(cors());
  app.use(express.json());

  // Define your routes
  app.use("/auth", authRoute);
  app.use(authenticate);
  app.use("/user", userRoute);
  app.use("/chat", chatRoute);

  // Socket.IO logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // --- CHAT FUNCTIONALITY ---
    socket.on("joinChat", ({ matchId }) => {
      socket.join(matchId); // Join a specific room
      console.log(`User joined chat room: ${matchId}`);
    });

    socket.on("sendMessage", (data) => {
      const { matchId, sender, content } = data;
      io.to(matchId).emit("receiveMessage", { sender, content }); // Broadcast message to room
    });

    // --- CHESS GAME FUNCTIONALITY ---
    socket.on("joinGame", ({ matchId, userId }) => {
      socket.join(matchId);
      console.log(`User ${userId} joined game room: ${matchId}`);
    });

    socket.on("makeMove", async ({ matchId, gameId, move, userId }) => {
      try {
        const match = await Match.findById(matchId);
        if (!match) return;

        const game = match.games.find(g => g.gameId === gameId);
        if (!game) return;

        // Check turn validity
        const moveCount = game.moves.split(" ").length;
        const isWhiteTurn = moveCount % 2 === 0;
        if ((isWhiteTurn && game.whitePlayer.toString() !== userId) || 
            (!isWhiteTurn && game.blackPlayer.toString() !== userId)) {
          socket.emit("invalidMove", { message: "Not your turn" });
          return;
        }

        // Update game moves
        game.moves += (game.moves ? " " : "") + move;
        await match.save();

        // Broadcast move to both players
        io.to(matchId).emit("updateBoard", { move });

      } catch (error) {
        console.error(error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Start the server
  server.listen(8080, () => {
    console.log("Backend running on 8080");
  });
} catch (error) {
  console.error(error);
}
