export class GameManager {
  static uniqueId = 0;

  room: string;
  maxPlayers = 4; // TODO: change this to an 'opts' object when more options are added
  currentPlayerCount = 1;

  // should not be called directly
  // TODO: throw if constructor is called directly
  constructor(room: string, maxPlayers?: number) {
    if (maxPlayers && maxPlayers < 8) {
      this.maxPlayers = maxPlayers;
    }

    this.room = room;
  }

  isFull() {
    return this.currentPlayerCount === this.maxPlayers;
  }

  isEmpty() {
    return this.currentPlayerCount === 0;
  }

  static createGame(maxPlayers?: number) {
    if (maxPlayers) {
      return new GameManager(`room${GameManager.uniqueId++}`, maxPlayers);
    }
    return new GameManager(`room${GameManager.uniqueId++}`);
  }
}
