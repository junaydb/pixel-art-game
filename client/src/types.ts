import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/shared/socketio-types";
import type { Socket } from "socket.io-client";

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
