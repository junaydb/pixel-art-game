import { createServer } from "node:http";
import { Server } from "socket.io";
import ioc from "socket.io-client";
import SocketEventHandler from "@/classes/SocketEventHandler";
import type { AddressInfo } from "node:net";
import type { Socket } from "socket.io-client";
import type { ServerSocket, TypedServer } from "@/util/types";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/shared/socketio-types";

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

describe("Socket", () => {
  let io: TypedServer;
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;
  const socketEventHandler = new SocketEventHandler();

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it.todo("Should receive initial game state");
});
