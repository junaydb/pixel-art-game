import { SocketData } from "@/shared/socketio-types";

export function getParentDir(path: string) {
  const dirs = path.split("/");
  dirs.pop();
  return dirs.join("/");
}

const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const WHITE = "\u001b[37m";
export function socketLog(
  data: SocketData,
  msg: string,
  colour?: "red" | "green" | "yellow"
) {
  let activeColour;
  let hasNickname = false;
  if (data.nickname) hasNickname = true;

  switch (colour) {
    case "red":
      activeColour = RED;
      break;
    case "green":
      activeColour = GREEN;
      break;
    case "yellow":
      activeColour = YELLOW;
      break;
    default:
      activeColour = WHITE;
  }

  if (hasNickname) {
    console.log(
      `WebSocket[${data.id}] (${data.nickname}): ${activeColour}${msg}${WHITE}`
    );
  } else {
    console.log(`WebSocket[${data.id}] (no nickname): ${activeColour}${msg}${WHITE}`);
  }
}

export function randInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
