import Player from "./Player.js";
import { SpriteID, State } from "../config/constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";

export default class SuperPlayer extends Player {
  constructor(xPos, yPos, hp, mana, playerId) {
    
    const superHp = hp;
    const superMana = mana;
    

    super(xPos, yPos, superHp, superMana, playerId);
    this.id = SpriteID.SUPER_HERO;
    this.state = State.STILL;
    this.imageSet = new ImageSet(23, 0, 160, 160, 50, 30);
    this.frames = new Frames(4, 12); 
    this.physics = new Physics(20, 0, 30);
    this.hitBox = new HitBox(32, 32, 7.5, 29);

    console.log("¡SuperPlayer created! HP:", this.hp, "Mana:", this.mana, "Velocity:", this.physics.vLimit);
  }

  update() {
    this.combatUpdate();
  }
  
}