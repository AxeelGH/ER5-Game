import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class Slime extends Enemy {
    constructor(xPos, yPos) {
        const imageSet = new ImageSet(10, 0, 32, 32, 0, 0, 32);
        const frames = new Frames(4, 6);
        const physics = new Physics(0); // Sin movimiento
        const hitBox = new HitBox(28, 28, 2, 2);
        
        super(SpriteID.SLIME, State.ENEMY_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 50);
    }
}