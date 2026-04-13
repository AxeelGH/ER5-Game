// SpriteFactory.js
import Player from './Player.js';
import Slime from './Slime.js';
import Skeleton from './Skeleton.js';
import Mage from './Mage.js';
import Object from './Object.js';

export default class SpriteFactory {
    
    static createPlayer(xPos, yPos, hp, mana) {
        return new Player(xPos, yPos, hp, mana);
    }
    
    static createSlime(xPos, yPos) {
        return new Slime(xPos, yPos);
    }
    
    static createSkeleton(xPos, yPos) {
        return new Skeleton(xPos, yPos);
    }
    
    static createMage(xPos, yPos) {
        return new Mage(xPos, yPos);
    }

    static createObject(xPos, yPos) {
        return new Object(xPos, yPos);
    }
}