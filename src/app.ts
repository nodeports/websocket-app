import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { setupSocket } from "./socket";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Redis client
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Setup Socket.IO
setupSocket(io, redisClient);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Root route to render the HTML page
app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
