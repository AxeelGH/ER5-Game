import Enemy from "./Enemy.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import globals from "./globals.js";

export default class Mage extends Enemy {
  constructor(xPos, yPos) {
    const imageSet = new ImageSet(33, 0, 48, 64, 0, 0);
    const frames = new Frames(3, 20);

    const initAngle = (90 * Math.PI) / 180;
    const omega = 1.2;
    const xRotCenter = 100;
    const yRotCenter = 100;
    const physics = new Physics(0, 0, 0, omega, initAngle, xRotCenter, yRotCenter);
    const hitBox = new HitBox(34, 56, 6, 7);

    super(SpriteID.MAGE, State.ENEMY_STILL, xPos, yPos, imageSet, frames, physics, hitBox, 60);

    this.baseX = xPos;
    this.baseY = yPos;
    this.radius = 20;
  }

  update() {
    this.physics.angle += this.physics.omega * globals.deltaTime;
    this.setMagePosition();
    this.updateAnimationFrame();
  }

  setMagePosition() {
    this.xPos = this.baseX + this.radius * Math.cos(this.physics.angle);
    this.yPos = this.baseY + this.radius * Math.sin(this.physics.angle);

    this.xPos -= this.imageSet.xSize / 2;
    this.yPos -= this.imageSet.ySize / 2;
  }
}
