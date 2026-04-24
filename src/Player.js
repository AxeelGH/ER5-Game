import Sprite from "./Sprite.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import globals from "./globals.js";
import CollisionManager from "./CollisionManager.js";

export default class Player extends Sprite {
  constructor(xPos, yPos, hp, mana) {
    super();

    this.id = SpriteID.HERO;
    this.state = State.STILL_DOWN;
    this.xPos = xPos;
    this.yPos = yPos;
    this.hp = hp;
    this.maxHp = hp;
    this.mana = mana;
    this.maxMana = mana;

    this.imageSet = new ImageSet(39, 0, 48, 64, 0, 0);
    this.frames = new Frames(3, 8);
    this.physics = new Physics(0, 0, 100);
    this.hitBox = new HitBox(32, 32, 7.5, 29);
    this.animationTimer = 0;

    console.log("Player created with HP:", this.hp, "at", this.xPos, this.yPos);
  }

  update() {
    this.readKeyboardAndAssignState();

    switch (this.state) {
      case State.UP:
        this.physics.vx = 0;
        this.physics.vy = -this.physics.vLimit;
        break;
      case State.DOWN:
        this.physics.vx = 0;
        this.physics.vy = this.physics.vLimit;
        break;
      case State.RIGHT:
        this.physics.vx = this.physics.vLimit;
        this.physics.vy = 0;
        break;
      case State.LEFT:
        this.physics.vx = -this.physics.vLimit;
        this.physics.vy = 0;
        break;
      default:
        this.physics.vx = 0;
        this.physics.vy = 0;
    }

    this.xPos += this.physics.vx * globals.deltaTime;

    if (CollisionManager.detectCollisionWithMap(this)) {
      CollisionManager.resolveMapCollision(this);
    }

    this.yPos += this.physics.vy * globals.deltaTime;

    if (CollisionManager.detectCollisionWithMap(this)) {
      CollisionManager.resolveMapCollision(this);
    }

    this.checkLevelTransition();

    this.updateAnimationFrame();
  }

  combatUpdate() {
    if (this.animationTimer > 0) {
      this.animationTimer--;
      this.updateAnimationFrame();
    } else {
      this.state = State.RIGHT;
    }
  }

  readKeyboardAndAssignState() {
    if (globals.action.moveLeft) {
      this.state = State.LEFT;
    } else if (globals.action.moveRight) {
      this.state = State.RIGHT;
    } else if (globals.action.moveUp) {
      this.state = State.UP;
    } else if (globals.action.moveDown) {
      this.state = State.DOWN;
    } else {
      if (this.state === State.LEFT) this.state = State.STILL_LEFT;
      else if (this.state === State.RIGHT) this.state = State.STILL_RIGHT;
      else if (this.state === State.UP) this.state = State.STILL_UP;
      else if (this.state === State.DOWN) this.state = State.STILL_DOWN;
    }
  }

  updateAnimationFrame() {
    this.frames.frameChangeCounter++;
    if (this.frames.frameChangeCounter >= this.frames.speed) {
      this.frames.frameCounter++;
      this.frames.frameChangeCounter = 0;
    }
    if (this.frames.frameCounter >= this.frames.framesPerState) {
      this.frames.frameCounter = 0;
    }
  }

  checkLevelTransition() {
    const canvasWidth = 1024;
    const canvasHeight = 768;
    const exitZone = 730;
    const safeZone = 20;

    if (this.yPos + this.hitBox.ySize >= exitZone) {
      console.log("next level");

      if (globals.gameInstance) {
        const success = globals.gameInstance.changeLevel(1);
        if (success) {
          this.yPos = 30;
          this.xPos = 500;
          this.levelTransitionCooldown = 1.0;
          console.log("next level");
        }
      }
    } else if (this.yPos <= 5) {
      console.log("level back");

      if (globals.gameInstance) {
        const success = globals.gameInstance.changeLevel(-1);
        if (success) {
          this.yPos = canvasHeight - 150;
          this.xPos = 500;
          this.levelTransitionCooldown = 1.0;
          console.log("level 1");
        }
      }
    }
  }
}