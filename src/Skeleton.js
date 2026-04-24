import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import globals from "./globals.js";

export default class Skeleton extends Enemy {
  constructor(xPos, yPos) {
    const imageSet = new ImageSet(217, 0, 32, 32, 0, 0);
    const frames = new Frames(2, 8);
    const physics = new Physics(0, 20, 20);
    const hitBox = new HitBox(20, 30, 5, 3);

    super(SpriteID.SKELETON, State.SKELETON_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 80);

    this.baseY = yPos;
    this.range = 60;
  }
  update() {
    this.setSkeletonPosition();
    this.updateAnimationFrame();
  }

  setSkeletonPosition() {
    const dt = globals.deltaTime || 1 / 60;
    this.yPos += this.physics.vy * dt;

    if (this.yPos > this.baseY + this.range) {
      this.yPos = this.baseY + this.range;
      this.physics.vy *= -1;
    }

    if (this.yPos < this.baseY - this.range) {
      this.yPos = this.baseY - this.range;
      this.physics.vy *= -1;
    }
  }
}
