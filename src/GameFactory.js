import { Game } from "./game.js";

export default class GameFactory {
  constructor(data) {
    this.gameData = data;
  }

  async create(canvas) {
    return await Game.create(canvas, this.gameData);
  }
}
