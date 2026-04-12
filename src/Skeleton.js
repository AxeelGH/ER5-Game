import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class Skeleton extends Enemy {
    constructor(xPos, yPos) {
        const imageSet = new ImageSet(145, 0, 32, 48, 0, 0);
        const frames = new Frames(4, 8);
        const physics = new Physics(0);
        const hitBox = new HitBox(24, 44, 4, 2);
        
        super(SpriteID.SKELETON, State.SKELETON_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 80);
    }
}