import globals from "./globals.js";
import { SpriteID } from "./constants.js";
import Player from "./Player.js";
import Enemy from "./Enemy.js";

export default class CombatView {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render() {
    const enemy = globals.currentEnemy;
    const player = globals.player;
    enemy.combatUpdate();
    player.combatUpdate();
    player.updateAnimationFrame();

    if (enemy.id === SpriteID.MAGE) {
      this.drawEnemy(enemy, 450, 130, 500, 500);
    } else if (enemy.id === SpriteID.SLIME) {
      this.drawEnemy(enemy, 450, 160, 500, 500);
    } else {
      this.drawEnemy(enemy, 300, 100, 700, 700);
    }

    this.drawPlayer(player, 80, 120, 500, 500);
    
  }

  drawEnemy(enemy, x, y, width, height) {
    const frameIndex = enemy.frames.frameCounter;
    const img = globals.tileSets[0];

    const originalWidth = enemy.combatImageSet.xSize;
    const originalHeight = enemy.combatImageSet.ySize;

    const col = enemy.combatImageSet.initCol + frameIndex;
    const row = enemy.combatImageSet.initFil + enemy.state;

    const xTile = col * originalWidth + enemy.combatImageSet.xOffset;
    const yTile = row * originalHeight + enemy.combatImageSet.yOffset;

    if (enemy.id === SpriteID.SKELETON) {
      this.ctx.drawImage(img, xTile, yTile, originalWidth, originalHeight, x, y, width, height);
    } else {
      this.ctx.drawImage(img, xTile, yTile,  originalWidth, originalHeight, x, y, width, height);
    }
  }

  drawPlayer(player, x, y, width, height) {
    const frameIndex = player.frames.frameCounter;
    const img = globals.tileSets[0];

    const originalWidth = player.combatImageSet.xSize;
    const originalHeight = player.combatImageSet.ySize;

    const col = player.combatImageSet.initCol + frameIndex;
    const row = player.combatImageSet.initFil + player.state;

    const xTile = col * originalWidth + player.combatImageSet.xOffset;
    const yTile = row * originalHeight + player.combatImageSet.yOffset;

    this.ctx.drawImage(img, xTile, yTile, originalWidth, originalHeight, x, y, width, height);
  }
}
