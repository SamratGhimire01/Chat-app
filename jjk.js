const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid"); // For generating user IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = new Map(); // Stores user ID -> socket ID

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  // Generate and assign user ID
  const userId = uuidv4();
  users.set(userId, socket.id);
  socket.emit("user-id", userId);

  // Handle private messages
  socket.on("private-message", ({ to, message }) => {
    const recipientSocketId = users.get(to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private-message", message);
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    users.delete(userId);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
