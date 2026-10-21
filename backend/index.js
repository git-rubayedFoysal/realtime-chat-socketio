import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 8000;
const ROOM = "my-room";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:5173"], credentials: true },
});

io.on("connection", (socket) => {
  socket.on("join-room", (username) => {
    socket.join(ROOM);
    console.log(`${username} was connected to room:${ROOM}.`);

    socket.to(ROOM).emit("room-notice", username);
  });

  socket.on("chat:msg", (msg) => {
    socket.to(ROOM).emit("chat:msg", msg);
  });

  socket.on("typing", (username) => {
    socket.to(ROOM).emit("typing", username);
  });
  socket.on("stop:typing", (username) => {
    socket.to(ROOM).emit("stop:typing", username);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server was listening on http://localhost:${PORT}`);
});
