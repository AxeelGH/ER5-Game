import { SpriteID } from './constants.js';
import globals from './globals.js';

export default class CombatView {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render() {
        const enemy = globals.currentEnemy;
        this.drawEnemy(enemy, 300, 0, 500, 500);
    }

    drawEnemy(enemy, x, y, width = 120, height = 120) {

        const frameIndex = enemy.frames.frameCounter;
        const img = globals.tileSets[0];
        
        const originalWidth = enemy.combatImageSet.xSize;
        const originalHeight = enemy.combatImageSet.ySize;
        
        const col = enemy.combatImageSet.initCol + frameIndex;
        const row = enemy.combatImageSet.initFil + enemy.state;

        this.ctx.drawImage(
            img,
            col * originalWidth,
            row * originalHeight,
            originalWidth,
            originalHeight,
            x, y,
            width, height
        );
    }

}