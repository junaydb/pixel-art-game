import express from "express";
import morgan from "morgan";
import { createServer } from "node:https";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { Server } from "socket.io";
import { getParentDir } from "./util/helpers";
import { TypedServer } from "./util/types";
import * as socketHandler from "./util/socket-handlers";

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(
  {
    key: readFileSync(join(getParentDir(__dirname), "ssl/localhost-key.pem")),
    cert: readFileSync(join(getParentDir(__dirname), "ssl/localhost.pem")),
  },
  app
);
const io: TypedServer = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  connectionStateRecovery: {},
});

app.use(morgan("tiny"));
app.use(express.static("build"));

io.on("connection", (socket) => {
  socketHandler.init(socket, true);

  socket.on("disconnect", () => socketHandler.disconnect(socket, true));

  socket.on("joinGame", (nickname) => socketHandler.joinGame(nickname, socket, true));
});

server.listen(PORT, () => {
  console.log(`server running at https://localhost:${PORT}`);
});
