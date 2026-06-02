// src/sprites/Sword.js
import Item from "./Item.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { SpriteID } from "../config/constants.js";
import globals from "../config/globals.js";

export default class Sword extends Item {
  constructor(xPos, yPos) {
    super(xPos, yPos);
    this.spriteID = SpriteID.SWORD;
    this.type = "sword";
    this.isCollected = false;
    this.hasBeenCollected = false;
    
    // Usar un ImageSet específico para la espada
    this.imageSet = new ImageSet(0, 0, 16, 16, 0, 0, 16);
    
    // Opcional: animación para la espada
    this.frames = new Frames(4, 15);
  }

  update() {
    this.updateAnimationFrame();
  }

  draw(ctx) {
    const img = globals.tileSets[2];
    if (!img || !img.complete) return;
    
    const currentFrame = this.frames.getCurrentFrame();
    const frameX = (this.imageSet.initCol + currentFrame) * this.imageSet.xSize;
    const frameY = this.imageSet.initFil * this.imageSet.ySize;
    
    ctx.drawImage(
      img,
      frameX, frameY,
      this.imageSet.xSize, this.imageSet.ySize,
      this.xPos, this.yPos,
      this.imageSet.xSize, this.imageSet.ySize
    );
  }

  static clone(sword) {
    const cloneSword = new Sword(sword.xPos, sword.yPos);
    
    cloneSword.spriteID = sword.spriteID;
    cloneSword.type = sword.type;
    cloneSword.state = sword.state;
    cloneSword.isCollected = sword.isCollected;
    cloneSword.hasBeenCollected = sword.hasBeenCollected;
    
    cloneSword.imageSet = sword.imageSet;
    cloneSword.frames = sword.frames;
    cloneSword.physics = sword.physics;
    cloneSword.hitBox = sword.hitBox;
    
    cloneSword.isCollidingWithPlayer = sword.isCollidingWithPlayer;
    
    return cloneSword;
  }
}