import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class Mage extends Enemy {
    constructor(xPos, yPos) {
        const imageSet = new ImageSet(0, 0, 110, 110, 0, 0);
        const frames = new Frames(4, 8);
        const physics = new Physics(0);
        const hitBox = new HitBox(26, 44, 3, 2);
        
        super(SpriteID.MAGE, State.ENEMY_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 60);
    }
}