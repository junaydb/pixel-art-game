import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/shared/socketio-types";

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
