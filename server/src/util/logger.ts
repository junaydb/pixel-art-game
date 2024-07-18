import type { SocketData } from "@/shared/socketio-types";

const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const WHITE = "\u001b[37m";

function colourPicker(colour: string | undefined) {
  switch (colour) {
    case "red":
      return RED;
    case "green":
      return GREEN;
    case "yellow":
      return YELLOW;
    default:
      return WHITE;
  }
}

export const logEnabled = true;

export function socket(
  data: SocketData,
  msg: string,
  colour?: "red" | "green" | "yellow",
) {
  if (!logEnabled) return;

  const logColour = colourPicker(colour);

  console.log(
    `WS[${data.id}](${data.nickname}@${data.game.roomId}): ${logColour}${msg}${WHITE}`,
  );
}

export function room(
  roomId: string,
  msg: string,
  colour?: "red" | "green" | "yellow",
) {
  if (!logEnabled) return;

  const logColour = colourPicker(colour);

  console.log(`Game@[${roomId}]: ${logColour}${msg}${WHITE}`);
}
