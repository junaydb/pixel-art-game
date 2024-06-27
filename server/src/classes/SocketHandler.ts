import { randInRange, socketLog } from "../util/helpers";
import type { ServerSocket } from "../util/types";
import { GameManager } from "./GameManager";

export class SocketHandler {
  static instance: SocketHandler;

  uniqueId = 0;
  log: boolean;
  joinableGames: GameManager[] = [];

  constructor(log?: boolean) {
    this.log = Boolean(log);
    if (!SocketHandler.instance) {
      SocketHandler.instance = this;
    }
    return SocketHandler.instance;
  }

  init(socket: ServerSocket) {
    if (this.log) socketLog(socket.data, "connected", "green");

    socket.data.id = this.uniqueId++;
    socket.emit("init", socket.data.id);
  }

  joinGame(nickname: string, socket: ServerSocket) {
    socket.data.nickname = nickname;
    if (this.log) socketLog(socket.data, `set nickname to '${nickname}'`);

    let game: GameManager;

    if (this.joinableGames.length === 0) {
      game = GameManager.createGame();

      socket.join(game.room);
      socket.data.game = game;
      this.joinableGames.push(game);
      if (this.log) {
        socketLog(
          socket.data,
          `game ${socket.data.game.room} created`,
          "green",
        );
      }
    } else {
      // randomly select a game from the joinable games, then join it
      // TODO: use heuristics such as num players in each lobby to select game to join
      game = this.joinableGames[randInRange(0, this.joinableGames.length)];

      socket.join(game.room);
      socket.data.game = game;
      if (this.log)
        socketLog(socket.data, `joined ${socket.data.game.room}`, "green");

      // tell all sockets in this game that this socket has joined
      socket.to(socket.data.game.room).emit("playerJoined", socket.data.id);

      // check if this game is now full after incrementing, if so, remove it from the joinable games
      game.currentPlayerCount++;

      if (game.isFull()) {
        this.joinableGames = this.joinableGames.filter((elem) => {
          elem.room !== game.room;
        });
        if (this.log) {
          socketLog(
            socket.data,
            `${socket.data.game.room} no longer joinable`,
            "yellow",
          );
        }
      }
    }
  }

  disconnect(socket: ServerSocket) {
    if (this.log) socketLog(socket.data, "disconnected", "red");
    if (!socket.data.game) return;

    const game = socket.data.game;

    // if this game was full, add it back to the joinable games
    if (game.isFull()) {
      this.joinableGames.push(socket.data.game);
      if (this.log) {
        socketLog(socket.data, `game ${socket.data.game.room} is rejoinable`);
      }
    }

    socket.data.game.currentPlayerCount--;

    // destroy this GameManager object if the game is now empty
    if (game.isEmpty()) {
      this.joinableGames = this.joinableGames.filter((elem) => {
        elem.room !== game.room;
      });
      if (this.log) {
        socketLog(
          socket.data,
          `game ${socket.data.game.room} was destroyed`,
          "yellow",
        );
      }
    } else {
      // tell the sockets still in this game that this socket has disconnected
      socket.to(socket.data.game.room).emit("playerLeft", socket.data.id);
      if (this.log) {
        socketLog(socket.data, `left game ${socket.data.game.room}`, "yellow");
      }
    }
  }
}
