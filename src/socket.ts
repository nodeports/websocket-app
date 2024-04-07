import { Server, Socket } from "socket.io";
import { RedisClientType } from "redis";

export function setupSocket(io: Server, redisClient: RedisClientType) {
  io.on("connection", (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join a room
    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    // Leave a room
    socket.on("leaveRoom", (room: string) => {
      socket.leave(room);
      console.log(`Client ${socket.id} left room ${room}`);
    });

    // Handle messages
    socket.on("message", (data) => {
      const { room, message } = data;
      io.to(room).emit("message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Redis Pub/Sub
  redisClient.subscribe("chat");
  redisClient.on("message", (channel, message) => {
    io.emit("message", message);
  });
}
