import { Game } from "./game.js";

export default class GameFactory {

    constructor(data) {
        this.gameData = data;
    }

    create(canvas) {
        
        return Game.create(canvas, this.gameData);
    } 

}