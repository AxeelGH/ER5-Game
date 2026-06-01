import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import Sprite from "./Sprite.js";
import { SpriteID, State } from "../config/constants.js";

export default class Item extends Sprite {
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
    this.updateAnimationFrame();
  }

  static clone(item) {
    const cloneItem = new Item(item.xPos, item.yPos);

    cloneItem.spriteID = item.spriteID;
    cloneItem.type = item.type;
    cloneItem.state = item.state;

    cloneItem.imageSet = item.imageSet;
    cloneItem.frames = item.frames;
    cloneItem.physics = item.physics;
    cloneItem.hitBox = item.hitBox;

    cloneItem.isCollected = item.isCollected;
    cloneItem.isCollidingWithPlayer = item.isCollidingWithPlayer;

    return cloneItem;
  }
}
