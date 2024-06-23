import { ServerSocket } from "./types";
import { socketLog, randInRange } from "./helpers";
import { GameManager } from "./game-manager";

let uniqueId = 0;
let joinableGames: GameManager[] = [];

export function init(socket: ServerSocket, log?: boolean) {
  socket.data.id = uniqueId++;
  if (log) socketLog(socket.data, "connected", "green");
  socket.emit("init", socket.data.id);
}

export function joinGame(nickname: string, socket: ServerSocket, log?: boolean) {
  socket.data.nickname = nickname;
  if (log) socketLog(socket.data, `set nickname to '${nickname}'`);

  let game: GameManager;

  if (joinableGames.length == 0) {
    game = GameManager.createGame();
    socket.join(game.room);
    socket.data.game = game;
    joinableGames.push(game);
    if (log) socketLog(socket.data, `game ${socket.data.game.room} created`, "green");
  } else {
    // randomly select a game from the joinable games, then join it
    // TODO: use heuristics such as num players in each lobby to select game to join
    game = joinableGames[randInRange(0, joinableGames.length)];
    socket.join(game.room);
    socket.data.game = game;
    if (log) socketLog(socket.data, `joined ${socket.data.game.room}`, "green");

    // tell all sockets in this game that this socket has joined
    socket.to(socket.data.game.room).emit("joinedGame", socket.data.id);

    // check if this game is now full after joining, if so, remove it from the joinable games
    game.currentPlayerCount++;
    if (game.isFull()) {
      joinableGames = joinableGames.filter((elem) => {
        elem.room !== game.room;
      });
      if (log) {
        socketLog(socket.data, `${socket.data.game.room} no longer joinable`, "yellow");
      }
    }
  }
}

export function disconnect(socket: ServerSocket, log?: boolean) {
  if (log) socketLog(socket.data, "disconnected", "red");
  if (!socket.data.game) return;

  let game = socket.data.game;

  // if this game was full, add it back to the joinable games
  if (game.isFull()) {
    joinableGames.push(socket.data.game);
    if (log) socketLog(socket.data, `game ${socket.data.game.room} is rejoinable`);
  }
  socket.data.game.currentPlayerCount--;

  // drop remaining reference to this GameManager object
  if (game.isEmpty()) {
    joinableGames = joinableGames.filter((elem) => {
      elem.room !== game.room;
    });
    if (log) {
      socketLog(socket.data, `game ${socket.data.game.room} was destroyed`, "yellow");
    }
  } else {
    // tell the sockets still in this game that this socket has disconnected
    socket.to(socket.data.game.room).emit("leftGame", socket.data.id);
  }
}
