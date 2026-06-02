import Enemy from "./Enemy.js";
import { SpriteID, State } from "../config/constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import globals from "../config/globals.js";

export default class Slime extends Enemy {
  constructor(xPos, yPos) {
    const imageSet = new ImageSet(142, 0, 64, 48, 0, 0);
    const frames = new Frames(4, 10);
    const physics = new Physics(20, 0, 20);
    const hitBox = new HitBox(25, 25, 20, 20);

    super(SpriteID.SLIME, State.SLIME_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 50);

    this.baseX = xPos;
    this.range = 60;
  }
  update() {
    this.setSlimePosition();
    this.updateAnimationFrame();
  }

  setSlimePosition() {
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

  static clone(slime) {
    const cloneSlime = new Slime(slime.xPos, slime.yPos);

    cloneSlime.spriteID = slime.spriteID;
    cloneSlime.name = slime.name;
    cloneSlime.state = slime.state;
    cloneSlime.life = slime.life;

    cloneSlime.imageSet = slime.imageSet;
    cloneSlime.frames = slime.frames;
    cloneSlime.physics = slime.physics;
    cloneSlime.hitBox = slime.hitBox;

    cloneSlime.baseX = slime.baseX;
    cloneSlime.range = slime.range;

    return cloneSlime;
  }
}
