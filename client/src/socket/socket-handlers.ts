import type { ClientSocket } from "@/types";

function socketLog(msg: string) {
  console.log(`WebSocket: ${msg}`);
}

export function joinGame(
  nickname: string,
  socket: ClientSocket,
  log?: boolean,
) {
  socket.emit("joinGame", nickname);
  if (log) socketLog("joining game...");
}
