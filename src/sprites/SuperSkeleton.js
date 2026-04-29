import Enemy from "./Enemy.js";
import { SpriteID, State } from "../config/constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import globals from "../config/globals.js";

export default class SuperSkeleton extends Enemy {
  constructor(xPos, yPos) {
    const imageSet = new ImageSet(40, 0, 160, 128, 0, 0);
    const frames = new Frames(8, 8);
    const physics = new Physics(20, 0, 20);
    const hitBox = new HitBox(25, 25, 20, 20);

    super(SpriteID.SUPER_SKELETON, State.SUPER_SKELETON_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 50);

    this.baseX = xPos;
    this.range = 60;
  }
  update() {
    this.setSuperSkeletonPosition();
    this.updateAnimationFrame();
  }

  setSuperSkeletonPosition() {
    const dt = globals.deltaTime || 1 / 60;
    this.xPos += this.physics.vx * dt;

    if (this.xPos > this.baseX + this.range) {
      this.xPos = this.baseX + this.range;
      this.physics.vx *= -1;
    }

    if (this.xPos < this.baseX - this.range) {
      this.xPos = this.baseX - this.range;
      this.physics.vx *= -1;
    }
  }
}
