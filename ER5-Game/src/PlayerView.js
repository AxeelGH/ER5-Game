import globals from './globals.js';

export default class playerView {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render() {
        if (!globals.player) return;

        const player = globals.player;
        const x = Math.floor(player.xPos);
        const y = Math.floor(player.yPos);

        this.ctx.save(); 
        this.ctx.globalAlpha = 1.0; 

        const img = globals.tileSets[0];
        if (img && img.complete && img.naturalWidth > 0 && player.imageSet && player.imageSet.loaded) {
            const frameIndex = (player.state * 4) + player.frames.frameCounter;
            player.imageSet.draw(this.ctx, x, y, frameIndex);
        } else {
            this.ctx.fillStyle = "#00ff00";
            this.ctx.fillRect(x, y, 48, 64);
        }
        
        this.ctx.restore();
    }

    drawSpriteRectangle(sprite) {
        const x = Math.floor(sprite.xPos);
        const y = Math.floor(sprite.yPos);
        this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
        this.ctx.fillRect(x, y, sprite.hitBox.xSize, sprite.hitBox.ySize);
    }

    drawHitBox(sprite) {
        const x = Math.floor(sprite.xPos) + sprite.hitBox.xOffset;
        const y = Math.floor(sprite.yPos) + sprite.hitBox.yOffset;
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, sprite.hitBox.xSize, sprite.hitBox.ySize);
    }
}