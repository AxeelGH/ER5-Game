import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class Mage extends Enemy {
    constructor(xPos, yPos) {
        const imageSet = new ImageSet(33, 0, 48, 64, 0, 0);
        const combatImageSet = new ImageSet(0.5, 0, 140, 140, 0, 0, 32);
        const frames = new Frames(4, 8);
        const physics = new Physics(0);
        const hitBox = new HitBox(34, 56, 6, 7);
        
        super(SpriteID.MAGE, State.ENEMY_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 60, combatImageSet);
    }
}