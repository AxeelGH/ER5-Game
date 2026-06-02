import Player from "./Player.js";
import Slime from "./Slime.js";
import Skeleton from "./Skeleton.js";
import Mage from "./Mage.js";
import Item from "./Item.js";
import SuperSlime from "./SuperSlime.js";
import SuperMage from "./SuperMage.js";
import SuperSkeleton from "./SuperSkeleton.js";
import SuperPlayer from "./SuperPlayer.js";
import Collectable from "./Collectable.js";

export default class SpriteFactory {
  static createPlayer(xPos, yPos, hp, mana, playerId) {
    return new Player(xPos, yPos, hp, mana);
  }

  static createSuperPlayer(xPos, yPos, hp, mana, playerId) {
    return new SuperPlayer(xPos, yPos, hp, mana, playerId);
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

  static createItem(xPos, yPos) {
    return new Item(xPos, yPos);
  }

  static createCollectable(xPos, yPos) {
  return new Collectable(xPos, yPos);
}
}
