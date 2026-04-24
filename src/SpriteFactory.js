// SpriteFactory.js
import Player from "./Player.js";
import Slime from "./Slime.js";
import Skeleton from "./Skeleton.js";
import Mage from "./Mage.js";
import Object from "./Object.js";

export default class SpriteFactory {
  static createPlayer(xPos, yPos, hp, mana) {
    return new Player(xPos, yPos, hp, mana);
  }

  static createSlime(xPos, yPos) {
    return new Slime(xPos, yPos);
  }

  static createSkeleton(xPos, yPos) {
    return new Skeleton(xPos, yPos);
  }

  static createMage(xPos, yPos) {
    return new Mage(xPos, yPos);
  }

  static createSuperSlime(xPos, yPos) {
    return new SuperSlime(xPos, yPos);
  }

  static createSuperMage(xPos, yPos) {
    return new SuperMage(xPos, yPos);
  }

  static createSuperSkeleton(xPos, yPos) {
    return new SuperSkeleton(xPos, yPos);
  }

  static createObject(xPos, yPos) {
    return new Object(xPos, yPos);
  }
}
