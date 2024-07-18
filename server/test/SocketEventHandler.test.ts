// GameManager constructor spy
import { MockConstructorSpy } from "./MockConstructorSpy";
const GameManagerConstructorSpy = MockConstructorSpy(
  "@/classes/GameManager",
  "GameManager",
  true,
);
import GameManager from "@/classes/GameManager";

import { createServer } from "node:http";
import { Server } from "socket.io";
import ioc from "socket.io-client";
import type { AddressInfo } from "node:net";
import type { ServerSocket, TypedServer } from "@/util/types";
import type { ClientSocket } from "@/util/types";
import SocketEventHandler from "@/classes/SocketEventHandler";

describe("SocketEventHandler", () => {
  let io: TypedServer;
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;
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

  beforeEach(() => {
    socketEventHandler.joinableGames = [];
    GameManagerConstructorSpy.mockClear();
  });

  it("Should be a singleton", () => {
    const socketEventHandlerDupe = new SocketEventHandler();

    expect(socketEventHandlerDupe).toBe(socketEventHandler);
  });

  describe("joinGame", () => {
    it("Should assign unique IDs", () => {
      for (let i = 0; i < 1000; i++) {
        socketEventHandler.joinGame("", jest.fn(), serverSocket);

        expect(serverSocket.data.id).toEqual(i);
      }
    });

    it("Should assign a random nickname for empty nicknames", () => {
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(serverSocket.data.nickname).toBeTruthy();
    });

    it("Should create a new game if there are no joinable games", () => {
      expect(socketEventHandler.joinableGames.length).toEqual(0);

      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(GameManagerConstructorSpy).toHaveBeenCalledTimes(1);
      expect(socketEventHandler.joinableGames.length).toEqual(1);
    });

    it("Should add the player to a (random) game if there are joinable games", () => {
      for (let i = 0; i < 10; i++) {
        socketEventHandler.joinableGames.push(
          new GameManager(serverSocket, jest.fn()),
        );
      }

      expect(socketEventHandler.joinableGames.length).toEqual(10);

      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(socketEventHandler.joinableGames.length).toEqual(10);
    });

    it("Should remove a game from the joinable games if it is full after the player joins", () => {
      const game = new GameManager(serverSocket, jest.fn());

      // make the game have maxPlayers - 1 capacity
      for (let i = 0; i < game.maxPlayers - 1; i++) {
        socketEventHandler.joinGame("", jest.fn(), serverSocket);
      }

      expect(socketEventHandler.joinableGames[0].players.size).toEqual(
        game.maxPlayers - 1,
      );

      // add another player to the game, now making it full
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      expect(socketEventHandler.joinableGames.length).toEqual(0);
    });
  });

  describe("disconnect", () => {
    it("Should remove the game from the joinable games if it is empty after the player leaves", () => {
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      const game = socketEventHandler.joinableGames[0];

      expect(socketEventHandler.joinableGames.length).toEqual(1);

      socketEventHandler.disconnect(serverSocket);

      expect(game.isJoinable()).toEqual(false);
      expect(socketEventHandler.joinableGames.length).toEqual(0);
    });

    it("Should remove the game from the joinable games if it has one player remaining after the player leaves", () => {
      socketEventHandler.joinGame("", jest.fn(), serverSocket);
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      const game = socketEventHandler.joinableGames[0];

      expect(game.players.size).toEqual(2);
      expect(socketEventHandler.joinableGames.length).toEqual(1);

      socketEventHandler.disconnect(serverSocket);

      expect(game.players.size).toEqual(1);
      expect(game.isJoinable()).toEqual(false);
      expect(socketEventHandler.joinableGames.length).toEqual(0);
    });

    it("Should persist the game if it has 2 or more players after the player leaves", () => {
      socketEventHandler.joinGame("", jest.fn(), serverSocket);
      socketEventHandler.joinGame("", jest.fn(), serverSocket);
      socketEventHandler.joinGame("", jest.fn(), serverSocket);

      const game = socketEventHandler.joinableGames[0];

      expect(socketEventHandler.joinableGames.length).toEqual(1);

      socketEventHandler.disconnect(serverSocket);

      expect(game.isJoinable()).toEqual(true);
      expect(game.players.size).toEqual(2);
      expect(socketEventHandler.joinableGames.length).toEqual(1);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });
});
