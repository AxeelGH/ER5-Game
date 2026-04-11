import Sprite from "./Sprite.js";
import { SpriteID, State } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js"; 
import globals from "./globals.js";

export default class Player extends Sprite {

    constructor(xPos, yPos, hp, mana){
        
        super();

        this.id = SpriteID.HERO;
        this.state = State.STILL_DOWN; 
        this.xPos = xPos;
        this.yPos = yPos;
        this.hp = hp;
        this.mana = mana;

        this.imageSet = new ImageSet(29, 0, 48, 64, 0, 0, 64); 
        this.frames = new Frames(3, 3); 
        this.physics = new Physics(200); 
        this.hitBox = new HitBox(46, 60, 2, 2);

        console.log("Player created with HP:", this.hp, "at", this.xPos, this.yPos);
    }

    update() {
        this.readKeyboardAndAssignState();

        switch(this.state){
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
        this.yPos += this.physics.vy * globals.deltaTime;

        this.updateAnimationFrame();
    }

    readKeyboardAndAssignState(){
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

    updateAnimationFrame(){
        switch(this.state){
            case State.STILL_UP:
            case State.STILL_LEFT:
            case State.STILL_DOWN:
            case State.STILL_RIGHT:
                this.frames.frameCounter = 0;
                this.frames.frameChangeCounter = 0;
                break;
            default:
                this.frames.frameChangeCounter++;
                if(this.frames.frameChangeCounter >= this.frames.speed){
                    this.frames.frameCounter++;
                    this.frames.frameChangeCounter = 0;
                }
                if(this.frames.frameCounter >= this.frames.framesPerState){
                    this.frames.frameCounter = 0;
                }
        }
    }
}