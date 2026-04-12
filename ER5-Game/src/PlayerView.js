import globals from './globals.js';
import { Tile } from './constants.js';

export default class playerView {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render() {

        const player = globals.player;

        if (!globals.player) return;

        const xPosInit = player.imageSet.initCol * player.imageSet.xSize;
        const yPosInit = player.imageSet.initFil * player.imageSet.ySize;

        const xTile = xPosInit + player.frames.frameCounter * player.imageSet.xSize + player.imageSet.xOffset;
        const yTile = yPosInit + player.state * player.imageSet.ySize + player.imageSet.yOffset;

        const xPos = Math.floor(player.xPos);
        const yPos = Math.floor(player.yPos);

        globals.ctx.drawImage(
            globals.tileSets[Tile.SIZE_16],
            xTile, yTile,
            player.imageSet.xSize, player.imageSet.ySize,
            xPos, yPos,
            player.imageSet.xSize, player.imageSet.ySize
        );
    }

    drawSpriteRectangle() {
        const player = globals.player;
        const x = Math.floor(player.xPos);
        const y = Math.floor(player.yPos);
        this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
        this.ctx.fillRect(x, y, player.hitBox.xSize, player.hitBox.ySize);
    }

    drawHitBox() {
        const player = globals.player;
        const x = Math.floor(player.xPos) + player.hitBox.xOffset;
        const y = Math.floor(player.yPos) + player.hitBox.yOffset;
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, player.hitBox.xSize, player.hitBox.ySize);
    }
}