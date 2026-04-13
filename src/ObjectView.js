import globals from './globals.js';
import { Tile } from './constants.js';

export default class ObjectView {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
        render() {

            const object = globals.object;
            if (!object) return;
    
            const img = globals.tileSets[2];
            if (!img || !img.complete) return;  
    
            const xPos = Math.floor(object.xPos);
            const yPos = Math.floor(object.yPos);
    
    
            this.ctx.drawImage(
                img,
                0, 0,
                object.imageSet.xSize, object.imageSet.ySize,
                xPos, yPos,
                object.imageSet.xSize, object.imageSet.ySize
         );
        }
    
        drawSpriteRectangle() {
            const object = globals.object;
            const x = Math.floor(object.xPos);
            const y = Math.floor(object.yPos);
            this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            this.ctx.fillRect(x, y, object.hitBox.xSize, object.hitBox.ySize);
        }
    
        drawHitBox() {
            const object = globals.object;
            const x = Math.floor(object.xPos) + object.hitBox.xOffset;
            const y = Math.floor(object.yPos) + object.hitBox.yOffset;
            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, object.hitBox.xSize, object.hitBox.ySize);
        }

}