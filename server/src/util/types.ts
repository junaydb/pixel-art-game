import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@/shared/socketio-types";
import type { Server, Socket as SSocket } from "socket.io";
import type { Socket as CSocket } from "socket.io-client";

export type ServerSocket = SSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ClientSocket = CSocket<ServerToClientEvents, ClientToServerEvents>;
