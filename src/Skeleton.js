import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class Skeleton extends Enemy {
    constructor(xPos, yPos) {
        const imageSet = new ImageSet(217, 0, 32, 32, 0, 0);
        const combatImageSet = new ImageSet(38.6, 0, 120, 150, 0, 0, 32);
        const frames = new Frames(2, 8);
        const physics = new Physics(0);
        const hitBox = new HitBox(20, 30, 5, 3);
        
        super(SpriteID.SKELETON, State.SKELETON_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 80, combatImageSet);
    }
}