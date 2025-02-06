const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for testing)
  },
});

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:4000/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user registration
  socket.on("register-user", (username) => {
    if (Object.values(users).includes(username)) {
      socket.emit("registration-error", "Username already taken.");
    } else {
      users[socket.id] = username;
      socket.emit("registration-success", username);
      console.log(`User registered: ${username}`);
    }
  });

  // Handle private messages
  socket.on("private-message", ({ to, content }) => {
    const recipientSocketId = Object.keys(users).find((id) => users[id] === to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("new-message", {
        from: users[socket.id],
        content,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    console.log(`User disconnected: ${username}`);
  });
});

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
