import { createServer } from "node:http";
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import type { TypedServer } from "./util/types";
import SocketEventHandler from "./classes/SocketEventHandler";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const io: TypedServer = new Server(server, {
  cors: { origin: "*" },
  connectionStateRecovery: {},
});
const socketEventHandler = new SocketEventHandler();

app.use(morgan("tiny"));
// app.use(express.static("build"));

io.on("connection", (socket) => {
  if (!socket.recovered) {
    socket.on("joinGame", (nickname, callback) => {
      socketEventHandler.joinGame(nickname, callback, socket);
    });

    socket.on("disconnect", () => {
      socketEventHandler.disconnect(socket);
    });
  }
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
