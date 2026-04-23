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
    this.combatImageSet = new ImageSet(33, 0, 160, 120, 0, 0);
    this.frames = new Frames(3, 5);
    this.physics = new Physics(0, 0, 100);
    this.hitBox = new HitBox(32, 32, 7.5, 29);
    this.animationTimer = 0;

    this.isCollidingWithRightBorder = false;
    this.isCollidingWithLeftBorder = false;
    this.isCollidingWithTopBorder = false;
    this.isCollidingWithBottomBorder = false;

    console.log("Player created with HP:", this.hp, "at", this.xPos, this.yPos);
  }

  update() {
    this.readKeyboardAndAssignState();

    //Apply speed for each state
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

    // Mover temporalmente en X
    this.xPos += this.physics.vx * globals.deltaTime;

    // Verificar y resolver colisiones en X
    if (CollisionManager.detectCollisionWithMap(this)) {
      CollisionManager.resolveMapCollision(this);
    }

    // Mover temporalmente en Y
    this.yPos += this.physics.vy * globals.deltaTime;

    // Verificar y resolver colisiones en Y
    if (CollisionManager.detectCollisionWithMap(this)) {
      CollisionManager.resolveMapCollision(this);
    }

    this.detectBorderCollision();

    this.updateAnimationFrame();
  }

  combatUpdate() {
    if (this.animationTimer > 0) {
      this.animationTimer--;
      this.updateAnimationFrame();
    } else {
      this.state = State.LEFT;
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
      // Set idle states based on last movement
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

  detectBorderCollision() {
    const canvas = globals.canvas;
    const threshold = 10;
    
    this.isCollidingWithRightBorder = (this.xPos + this.hitBox.xOffset + this.hitBox.xSize >= canvas.width - threshold);
    this.isCollidingWithLeftBorder = (this.xPos + this.hitBox.xOffset <= threshold);
    this.isCollidingWithTopBorder = (this.yPos + this.hitBox.yOffset <= threshold + 20);
    this.isCollidingWithBottomBorder = (this.yPos + this.hitBox.yOffset + this.hitBox.ySize >= canvas.height - threshold);
  }

}
