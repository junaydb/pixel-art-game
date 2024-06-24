export class GameManager {
  static uniqueId: number = 0;

  room: string;
  maxPlayers: number = 4; // TODO: change this to an 'opts' object when more options are added
  currentPlayerCount: number = 1;

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
      return new GameManager(`room${this.uniqueId++}`, maxPlayers);
    } else {
      return new GameManager(`room${this.uniqueId++}`);
    }
  }
}
