import GameManager from "@/classes/GameManager";
import SocketEventHandler from "@/classes/SocketEventHandler";
import { createServer } from "node:http";
import { Server } from "socket.io";
import ioc from "socket.io-client";
import type { AddressInfo } from "node:net";
import type { ServerSocket, TypedServer } from "@/util/types";
import type { ClientSocket } from "@/util/types";

jest.useFakeTimers({ legacyFakeTimers: true });

describe("GameManager", () => {
  let io: TypedServer;
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;
  let game: GameManager;
  const socketEventHandler = new SocketEventHandler();

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterEach(() => {
    game?.players.clear();
    socketEventHandler.joinableGames = [];
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  describe("Constructor", () => {
    it("Should assign unique room IDs", () => {
      for (let i = 0; i < 1000; i++) {
        socketEventHandler.joinGame("", jest.fn(), serverSocket);

        game = socketEventHandler.joinableGames[0];

        expect(game.roomId).toMatch(
          new RegExp(`room${GameManager.uniqueId - 1}`),
        );

        // force new room to be created on next iteration
        socketEventHandler.joinableGames = [];
      }
    });
  });

  describe("addPlayer", () => {
    it("Should add the player to the players map", () => {
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      game = socketEventHandler.joinableGames[0];

      expect(game.players.get(serverSocket.data.id)).toEqual(serverSocket);
      expect(game.players.get(serverSocket.data.id)!.data.id).toEqual(
        serverSocket.data.id,
      );
    });

    it("Should call startGame once, when there are > 1 players", () => {
      const startGameMock = jest
        .spyOn(GameManager.prototype, "startGame")
        .mockImplementation(function (this: GameManager) {
          this.started = true;
        });

      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(startGameMock).toHaveBeenCalledTimes(0);

      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(startGameMock).toHaveBeenCalledTimes(1);

      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      // ensure startGame is never called again
      expect(startGameMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("removePlayer", () => {
    it("Should become unjoinable when the only player in the game leaves", () => {
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      game = socketEventHandler.joinableGames[0];

      socketEventHandler.disconnect(serverSocket);

      expect(game.players.has(serverSocket.data.id)).toEqual(false);
      expect(game.isJoinable()).toEqual(false);
    });

    it("Should call doGameOverSequence if there is only 1 player left whilst the game is in progress", () => {
      const doGameOverSequenceMock = jest
        .spyOn(GameManager.prototype, "doGameOverSequence")
        .mockImplementation(function (this: GameManager) {
          this.gameOver = true;
        });

      socketEventHandler.joinGame("", jest.fn(), serverSocket);
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      game = socketEventHandler.joinableGames[0];

      expect(game.players.size).toEqual(2);
      expect(game.started).toEqual(true);

      socketEventHandler.disconnect(serverSocket);

      expect(game.players.size).toEqual(1);
      expect(game.isJoinable()).toEqual(false);
      expect(doGameOverSequenceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("intervalTimer", () => {
    it("Should increment the round after each interval and end the game when currentRonud > maxRounds", () => {
      const nextDrawerMock = jest.spyOn(GameManager.prototype, "nextDrawer");

      socketEventHandler.joinGame("", jest.fn(), serverSocket);
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(nextDrawerMock).toHaveBeenCalledTimes(1);

      game = socketEventHandler.joinableGames[0];

      expect(game.currentRound).toEqual(1);
      expect(game.intervalTimerActive).toEqual(true);

      jest.advanceTimersByTime(game.drawTime);

      expect(game.currentRound).toEqual(2);
      expect(nextDrawerMock).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(game.drawTime);

      expect(game.currentRound).toEqual(3);
      expect(nextDrawerMock).toHaveBeenCalledTimes(3);

      jest.advanceTimersByTime(game.drawTime);

      expect(game.gameOver).toEqual(true);
      expect(game.isJoinable()).toEqual(false);
      expect(game.intervalTimerActive).toEqual(false);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });
});
