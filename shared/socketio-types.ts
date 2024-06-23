import { GameManager } from "../server/src/util/game-manager";

export interface ServerToClientEvents {
  init: (id: number) => void;
  memberDisconnect: (id: number) => void;
  joinedGame: (id: number) => void;
  leftGame: (id: number) => void;
}

export interface ClientToServerEvents {
  chat: (msg: string) => void;
  joinGame: (nickname: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
  nickname: string;
  game: GameManager;
}
