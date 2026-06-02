// src/sprites/Collectable.js
import Item from "./Item.js";
import { SpriteID, State } from "../config/constants.js";
import globals from "../config/globals.js";
import ImageSet from "./ImageSet.js";

export default class Collectable extends Item {
  constructor(xPos, yPos) {
    super(xPos, yPos);
    this.spriteID = SpriteID.COLLECTABLE;
    this.type = "collectable";
    this.isCollected = false;
  }

  static clone(collectable) {
    const cloneCollectable = new Collectable(collectable.xPos, collectable.yPos);
    
    cloneCollectable.spriteID = collectable.spriteID;
    cloneCollectable.type = collectable.type;
    cloneCollectable.state = collectable.state;
    
    cloneCollectable.imageSet = collectable.imageSet;
    cloneCollectable.frames = collectable.frames;
    cloneCollectable.physics = collectable.physics;
    cloneCollectable.hitBox = collectable.hitBox;
    
    cloneCollectable.isCollected = collectable.isCollected;
    cloneCollectable.isCollidingWithPlayer = collectable.isCollidingWithPlayer;
    
    return cloneCollectable;
  }
}