import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class Slime extends Enemy {
    constructor(xPos, yPos) {
        const imageSet = new ImageSet(142, 0, 48, 48, 0, 0);
        const combatImageSet = new ImageSet(40.5, 0, 200, 150, 0, 0, 32);
        const frames = new Frames(4, 6);
        const physics = new Physics(0); 
        const hitBox = new HitBox(25, 25, 20, 20);
        
        super(SpriteID.SLIME, State.SLIME_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 50, combatImageSet);
    }
}