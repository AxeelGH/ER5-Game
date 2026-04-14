// Enemy.js
import Sprite from "./Sprite.js";
import { SpriteID } from "./constants.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import globals from "./globals.js";

export default class Enemy extends Sprite {
    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox, hp, combatImageSet) {
        super();
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.combatImageSet = combatImageSet;
        this.frames = frames;
        this.physics = physics;
        this.hitBox = hitBox;
        this.hp = hp;
        this.maxHp = hp;
        this.isAlive = true;
        this.isCollidingWithPlayer = false;
    }

    update() {
        
        this.updateAnimationFrame();
    }

    draw(ctx) {
        const x = Math.floor(this.xPos);
        const y = Math.floor(this.yPos);
        
        if (this.imageSet && this.imageSet.loaded) {
            const frameIndex = this.frames.frameCounter;
            this.imageSet.draw(ctx, x, y, frameIndex, this.state);
        } else {
            
            ctx.fillStyle = this.getColor();
            ctx.fillRect(x, y, this.hitBox.xSize, this.hitBox.ySize);
        }
    }

    drawSpriteRectangle(ctx) {
        
        const x = Math.floor(this.xPos);
        const y = Math.floor(this.yPos);
        ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
        ctx.fillRect(x, y, this.hitBox.xSize, this.hitBox.ySize);
    }

    drawHitBox(ctx) {
        
        const x = Math.floor(this.xPos) + this.hitBox.xOffset;
        const y = Math.floor(this.yPos) + this.hitBox.yOffset;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.hitBox.xSize, this.hitBox.ySize);
    }

    getColor() {
        switch(this.id) {
            case SpriteID.SLIME: return "#00ff00";
            case SpriteID.SKELETON: return "#cccccc";
            case SpriteID.MAGE: return "#8800ff";
            default: return "#ff0000";
        }
    }
}