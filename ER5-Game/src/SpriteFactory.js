import Player from './Player.js';

export default class SpriteFactory {
    
    static createPlayer(xPos, yPos, hp, mana) {
        return new Player(xPos, yPos, hp, mana);
    }
}