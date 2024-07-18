import type { InitPayload } from "@/shared/socketio-types";
import type { ServerSocket } from "@/util/types";
import * as logger from "@/util/logger";
import { getUniqueRandomWords } from "@/words/words";

export default class GameManager {
  static uniqueId = 0;

  // namespace of this game
  roomId: string;

  // game configuration
  maxPlayers = 4;
  maxRounds = 3;
  drawTime = 20;

  // all sockets in this game
  players: Map<number, ServerSocket> = new Map();

  // words that have been used in this game
  usedWords = new Set<string>();

  // game timer
  intervalTimer = null as unknown as NodeJS.Timeout;
  intervalTimerActive = false;

  // game state
  started = false;
  gameOver = false;
  currentDrawer: ServerSocket | null = null;
  currentRound = 1;

  constructor(
    creator: ServerSocket,
    callback: (initPayload: InitPayload) => void,
  ) {
    // assign the unique room id and add the creator of this room to the players map
    this.roomId = `room${GameManager.uniqueId++}`;
    this.players.set(creator.data.id, creator);

    // tell this socket that they're in an empty game
    callback({ temp: `joined ${this.roomId}` });

    // logging
    creator.data.game = this;
    logger.socket(creator.data, "joined game", "green");
  }

  addPlayer(
    player: ServerSocket,
    responseCallback: (initPayload: InitPayload) => void,
  ) {
    // add this socket to the room
    this.players.set(player.data.id, player);

    // send the current game state to this socket
    responseCallback({ temp: `joined ${this.roomId}` });

    if (!this.started) this.startGame();

    // for logging
    player.data.game = this;
    logger.socket(player.data, "joined game", "green");
  }

  removePlayer(player: ServerSocket) {
    // remove this socket from the map of players
    this.players.delete(player.data.id);

    if (this.players.size === 0) {
      this.cleanup();

      logger.room(this.roomId, "game empty", "red");
    } else if (this.started && this.players.size === 1) {
      this.doGameOverSequence();

      logger.room(this.roomId, "game interrupted", "red");
    }

    logger.socket(player.data, "left game", "red");
  }

  startGame() {
    this.started = true;

    this.nextDrawer();

    this.intervalTimer = setInterval(() => {
      if (++this.currentRound > this.maxRounds) {
        this.doGameOverSequence();

        logger.room(this.roomId, "game over", "red");
      } else {
        this.nextDrawer();
      }
    }, this.drawTime);
    this.intervalTimerActive = true;
  }

  nextDrawer() {
    if (this.currentDrawer) {
      this.currentDrawer.emit(
        "chooseWord",
        getUniqueRandomWords(3, this.usedWords),
      );

      this.currentDrawer.to(this.roomId).emit("waitingForDrawer");

      logger.socket(this.currentDrawer.data, "is now drawing");
    }
  }

  doGameOverSequence() {
    this.cleanup();

    this.gameOver = true;
  }

  isJoinable() {
    // the game is not empty, has not ended, and isn't at capacity
    return (
      this.players.size > 0 &&
      this.players.size !== this.maxPlayers &&
      !this.gameOver
    );
  }

  cleanup() {
    clearInterval(this.intervalTimer);
    this.intervalTimerActive = false;
  }
}
