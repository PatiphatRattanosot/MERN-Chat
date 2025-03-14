require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { app, server } = require("./lid/socket.js");

// Cors
const cors = require("cors");
const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOption));
app.use(cookieParser());

// Routers
const AuthRouter = require("./routers/auth.router.js");
app.use("/api/v1/auth", AuthRouter);
const ChatRouter = require("./routers/message.router.js");
app.use("/api/v1/chat", ChatRouter);
const FriendRouter = require("./routers/friend.router.js");
app.use("/api/v1/friend", FriendRouter);

const PORT = process.env.PORT || 3000;
const { connectDB } = require("./lid/db.js");
connectDB();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API for Web Blog</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f7fc;
                margin: 0;
                padding: 0;
                color: #333;
              }
              header {
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 20px;
              }
              h1 {
                font-size: 2.5em;
                margin: 0;
              }
              main {
                padding: 20px;
                text-align: center;
              }
              p {
                font-size: 1.2em;
                margin: 10px 0;
              }
              footer {
                background-color: #333;
                color: white;
                text-align: center;
                padding: 10px;
                position: fixed;
                bottom: 0;
                width: 100%;
              }
              a {
                color: #4CAF50;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <header>
              <h1>Welcome to the API for SE Chat</h1>
            </header>
            <main>
              <p>This API provides the backend services for a simple web chat application.</p>
              </main>
            <footer>
              <p>&copy; 2025 Web Blog API. Create by Patiphat Rattanosot.</p>
            </footer>
          </body>
          </html>
        `);
});
