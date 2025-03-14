const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
});

const userSocketMap = {}; //{userId:socketId}

exports.getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  const userId = socket.handshake.query.userId;

  console.log("user connected", userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friendRequestSent", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestReceived", userId);
    }
  });

  socket.on("friendRequestAccepted", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestAccepted", userId);
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
  });
});

module.exports = { io, app, server };
