import type { ServerSocket } from "@/util/types";
import type { InitPayload } from "@/shared/socketio-types";
import { randInRange } from "@/util/helpers";
import * as logger from "@/util/logger";
import GameManager from "./GameManager";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

export default class SocketEventHandler {
  static instance: SocketEventHandler;

  uniqueId = 0;
  joinableGames: GameManager[] = [];

  constructor() {
    if (!SocketEventHandler.instance) {
      SocketEventHandler.instance = this;
    }
    return SocketEventHandler.instance;
  }

  joinGame(
    nickname: string,
    callback: (init: InitPayload) => void,
    socket: ServerSocket,
  ) {
    socket.data.id = this.uniqueId++;
    socket.data.nickname = nickname
      ? nickname
      : uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: "-",
          length: randInRange(1, 4),
        });

    if (this.joinableGames.length === 0) {
      // if there are no joinable games, create a new game
      const newGame = new GameManager(socket, callback);
      this.joinableGames.push(newGame);
      socket.data.game = newGame;
    } else {
      // choose a random game to join
      // TODO: use heuristics to select a game, e.g. num players or min. avg ping
      const selectedGame =
        this.joinableGames[randInRange(0, this.joinableGames.length)];

      // add this socket to the selected game
      selectedGame.addPlayer(socket, callback);

      // if this game is now full, remove it from the pool of joinable games
      if (!selectedGame.isJoinable()) {
        this.joinableGames = this.joinableGames.filter((game) => {
          game.roomId !== selectedGame.roomId;
        });
        logger.socket(
          socket.data,
          "game is no longer joinable (full)",
          "yellow",
        );
      }
    }
  }

  disconnect(socket: ServerSocket) {
    const game = socket.data.game;

    // remove socket from the game
    game.removePlayer(socket);

    // destroy this game if it's now empty
    if (!game.isJoinable()) {
      this.joinableGames = this.joinableGames.filter((cur) => {
        cur.roomId !== game.roomId;
      });

      logger.socket(socket.data, "game was destroyed", "yellow");
    }
  }
}
