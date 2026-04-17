import globals from './globals.js';
import { SpriteID } from './constants.js';

export default class CombatView {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render() {
        const enemy = globals.currentEnemy;
        
        if (enemy.id === SpriteID.MAGE) {
            this.drawEnemy(enemy, 450, 150,500,500);
        } else if (enemy.id === SpriteID.SLIME){
            this.drawEnemy(enemy,250, -50, 700, 700);
        } else {
            this.drawEnemy(enemy, 300, 100, 700, 700);
        }
        
    }

    drawEnemy(enemy, x, y, width = 120, height = 120) {

        const frameIndex = enemy.frames.frameCounter;
        const img = globals.tileSets[0];
        
        const originalWidth = enemy.combatImageSet.xSize;
        const originalHeight = enemy.combatImageSet.ySize;
        
        const col = enemy.combatImageSet.initCol + frameIndex;
        const row = enemy.combatImageSet.initFil + enemy.state;
   
        if(enemy.id === SpriteID.SKELETON){
            this.ctx.drawImage(
            img,
            col * originalWidth,
            row * originalHeight,
            originalWidth,
            originalHeight,
            x, y,
            width, height
        );
        } else {
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

}