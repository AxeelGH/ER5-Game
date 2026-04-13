import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import Sprite from "./Sprite.js";
import { SpriteID, State } from "./constants.js";

export default class Object extends Sprite{

    constructor(xPos, yPos) {
        super();
        this.spriteID = SpriteID.OBJECT;
        this.state = State.OBJECT_STILL;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = new ImageSet(0, 0, 16, 16, 0, 0, 16);
        this.frames = new Frames(1, 1);
        this.physics = new Physics(0);
        this.hitBox = new HitBox(16, 16, 0, 0);
        this.isCollidingWithPlayer = false;
        this.isCollected = false;
    }

    update() {

    }
}