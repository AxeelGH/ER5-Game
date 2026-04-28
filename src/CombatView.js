import globals from "./globals.js";
import { SpriteID, State } from "./constants.js";
import SuperSlime from "./SuperSlime.js";
import SuperMage from "./SuperMage.js";
import SuperSkeleton from "./SuperSkeleton.js";

export default class CombatView {
  constructor(ctx) {
    this.ctx = ctx;

    this.superSlime = new SuperSlime(0, 0);
    this.superMage = new SuperMage(0, 0);
    this.superSkeleton = new SuperSkeleton(0, 0);
  }

  render() {

    let enemies = globals.currentEnemies || (globals.currentEnemy ? [globals.currentEnemy] : []);
    const player = globals.player;
    
    const enemyPositions = [
      { x: 450, y: 160, w: 500, h: 500 },   // Left
      { x: 700, y: 160, w: 500, h: 500 },   // Right
      { x: 575, y: 100, w: 500, h: 500 }    // Center
    ];
    
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy.isAlive) continue;
      
      enemy.combatUpdate();
      
      const posIndex = Math.min(i, enemyPositions.length - 1);
      const pos = enemyPositions[posIndex];
      
      if (enemy.id === SpriteID.SLIME) {
        this.updateSuperEnemy(this.superSlime, enemy);
        this.drawEnemy(this.superSlime, pos.x, pos.y, pos.w, pos.h);
      } else if (enemy.id === SpriteID.SUPER_SLIME) {
        this.drawEnemy(enemy, pos.x, pos.y, pos.w, pos.h);
      } else if (enemy.id === SpriteID.MAGE) {
        this.updateSuperEnemy(this.superMage, enemy);
        this.drawEnemy(this.superMage, pos.x, pos.y, pos.w, pos.h);
      } else if (enemy.id === SpriteID.SUPER_MAGE) {
        this.drawEnemy(enemy, pos.x, pos.y, pos.w, pos.h);
      } else if (enemy.id === SpriteID.SKELETON) {
        this.updateSuperEnemy(this.superSkeleton, enemy);
        this.drawEnemy(this.superSkeleton, pos.x, pos.y - 60, pos.w, pos.h);
      } else if (enemy.id === SpriteID.SUPER_SKELETON) {
        this.drawEnemy(enemy, pos.x, pos.y, pos.w, pos.h);
      } else {
        this.drawEnemy(enemy, pos.x, pos.y, pos.w, pos.h);
      }
      
      this.drawEnemyHealthBar(enemy, pos.x, pos.y - 30, pos.w);
    }

    if (player) {
      this.drawPlayer(player, player.xPos, player.yPos, 300, 300);
    }
}

drawEnemyHealthBar(enemy, x, y, width) {
    const barWidth = 180;
    const barHeight = 15;
    const barX = x + (width / 2) - (barWidth / 2);
    const barY = y;
    
    this.ctx.fillStyle = "#330000";
    this.ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
    this.ctx.fillStyle = "#60ff44";
    this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
    
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "14px alkhemikal";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${Math.floor(enemy.hp)}/${enemy.maxHp}`, barX + barWidth / 2, barY + 12);
}

  updateSuperEnemy(superEnemy, normalEnemy) {
    superEnemy.animationTimer = normalEnemy.animationTimer;

    if (normalEnemy.id === SpriteID.SLIME) {
      if (normalEnemy.state === 0) {
        superEnemy.state = State.SUPER_SLIME_STILL;
      } else if (normalEnemy.state === 1) {
        superEnemy.state = State.SUPER_SLIME_MOVE;
      } else if (normalEnemy.state === 2) {
        superEnemy.state = State.SUPER_SLIME_ATTACK;
      }
    } else if (normalEnemy.id === SpriteID.MAGE) {
      if (normalEnemy.state === 0) {
        superEnemy.state = State.SUPER_MAGE_STILL;
      } else if (normalEnemy.state === 1) {
        superEnemy.state = State.SUPER_MAGE_ATTACK;
      } else if (normalEnemy.state === 2) {
        superEnemy.state = State.SUPER_MAGE_HIT;
      }
    } else if (normalEnemy.id === SpriteID.SKELETON) {
      if (normalEnemy.state === 0) {
        superEnemy.state = State.SUPER_SKELETON_STILL;
      } else if (normalEnemy.state === 1) {
        superEnemy.state = State.SUPER_SKELETON_ATTACK;
      } else if (normalEnemy.state === 2) {
        superEnemy.state = State.SUPER_SKELETON_HIT;
      }
    }

    superEnemy.frames.frameChangeCounter++;
    if (superEnemy.frames.frameChangeCounter >= superEnemy.frames.speed) {
      superEnemy.frames.frameCounter++;
      superEnemy.frames.frameChangeCounter = 0;
    }
    if (superEnemy.frames.frameCounter >= superEnemy.frames.framesPerState) {
      superEnemy.frames.frameCounter = 0;
    }
  }

  drawEnemy(enemy, x, y, width, height) {
    const frameIndex = enemy.frames.frameCounter;
    const img = globals.tileSets[0];

    const originalWidth = enemy.imageSet.xSize;
    const originalHeight = enemy.imageSet.ySize;

    const col = enemy.imageSet.initCol + frameIndex;
    const row = enemy.imageSet.initFil + enemy.state;

    const xTile = col * originalWidth + enemy.imageSet.xOffset;
    const yTile = row * originalHeight + enemy.imageSet.yOffset;

    this.ctx.drawImage(img, xTile, yTile, originalWidth, originalHeight, x, y, width, height);
  }

  drawPlayer(player, x, y, width, height) {
    const frameIndex = player.frames.frameCounter;
    const img = globals.tileSets[0];

    const originalWidth = player.imageSet.xSize;
    const originalHeight = player.imageSet.ySize;

    const col = player.imageSet.initCol + frameIndex;
    const row = player.imageSet.initFil + player.state;

    const xTile = col * originalWidth + player.imageSet.xOffset;
    const yTile = row * originalHeight + player.imageSet.yOffset;

    this.ctx.drawImage(img, xTile, yTile, originalWidth, originalHeight, x, y, width, height);
  }

  renderPhaseUI(ctx, combatTurn) {
    if (combatTurn.selectedPhase.renderUI) {
      combatTurn.selectedPhase.renderUI(ctx);
    }
  }
}
