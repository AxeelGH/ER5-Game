import globals from "../config/globals.js";
import { SpriteID, State } from "../config/constants.js";
import SuperSlime from "../sprites/SuperSlime.js";
import SuperMage from "../sprites/SuperMage.js";
import SuperSkeleton from "../sprites/SuperSkeleton.js";

export default class CombatView {
  constructor(ctx) {
    this.ctx = ctx;

    this.superSlime = new SuperSlime(0, 0);
    this.superMage = new SuperMage(0, 0);
    this.superSkeleton = new SuperSkeleton(0, 0);
  }

  render() {
    let enemies = [];
    if (globals.gameInstance && globals.gameInstance.combat) {
      enemies = globals.gameInstance.combat.enemies;
    } else {
      enemies = globals.currentEnemies || (globals.currentEnemy ? [globals.currentEnemy] : []);
    }
  let player = globals.player;

  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    if (!enemy.isAlive) continue;

    enemy.combatUpdate();

    let basePositions = [650, 500, 400]; // back, middle, front
    let xPos = enemy.combatX || basePositions[1];
    let yPos = 160;
    let width = 500;
    let height = 500;
    
    if (enemy.id === SpriteID.SKELETON || enemy.id === SpriteID.SUPER_SKELETON) {
      yPos = 100;
    } else if (enemy.id === SpriteID.MAGE || enemy.id === SpriteID.SUPER_MAGE) {
      yPos = 130;
    }

    if (enemy.id === SpriteID.SLIME) {
      this.updateSuperEnemy(this.superSlime, enemy);
      this.drawEnemy(this.superSlime, xPos, yPos, width, height);
    } else if (enemy.id === SpriteID.SUPER_SLIME) {
      this.drawEnemy(enemy, xPos, yPos, width, height);
    } else if (enemy.id === SpriteID.MAGE) {
      this.updateSuperEnemy(this.superMage, enemy);
      this.drawEnemy(this.superMage, xPos, yPos, width, height);
    } else if (enemy.id === SpriteID.SUPER_MAGE) {
      this.drawEnemy(enemy, xPos, yPos, width, height);
    } else if (enemy.id === SpriteID.SKELETON) {
      this.updateSuperEnemy(this.superSkeleton, enemy);
      this.drawEnemy(this.superSkeleton, xPos, yPos - 60, width, height);
    } else if (enemy.id === SpriteID.SUPER_SKELETON) {
      this.drawEnemy(enemy, xPos, yPos, width, height);
    } else {
      this.drawEnemy(enemy, xPos, yPos, width, height);
    }

    this.drawEnemyHealthBar(enemy, xPos, yPos - 30, width);
  }

  if (player) {
    player.combatUpdate();
    this.drawPlayer(player, player.xPos, player.yPos, 300, 300);
  }
}

  drawEnemyHealthBar(enemy, x, y, width) {
    const barWidth = 180;
    const barHeight = 15;
    const barX = x + width / 2 - barWidth / 2;
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
    superEnemy.hitBlinkTimer = normalEnemy.hitBlinkTimer;

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

    if (enemy.hitBlinkTimer === 0 || (enemy.hitBlinkTimer % 2 === 0)) {
      this.ctx.drawImage(img, xTile, yTile, originalWidth, originalHeight, x, y, width, height);
    }
  }

  drawPlayer(player, x, y, width, height) {
    const frameIndex = player.frames.frameCounter;
    const img = globals.tileSets[0];

    const originalWidth = player.imageSet.xSize;
    const originalHeight = player.imageSet.ySize;

    const col = player.imageSet.initCol + frameIndex;
    const row = player.imageSet.initFil + player.state;
    
    if (player.id !== SpriteID.SUPER_HERO) {
        row += player.state;
    }

    const xTile = col * originalWidth + player.imageSet.xOffset;
    const yTile = row * originalHeight + player.imageSet.yOffset;

    if (player.id === SpriteID.SUPER_HERO) {
        const scale = 2; 
        width *= scale;
        height = (originalHeight / originalWidth) * width; 
        const extraHeight = height - (width / scale); 
        y -= (extraHeight / 2); 
    }

    if (player.hitBlinkTimer === 0 || (player.hitBlinkTimer % 2 === 0)) {
      this.ctx.drawImage(img, xTile, yTile, originalWidth, originalHeight, Math.floor(x), Math.floor(y), width, height);
    }
  }

  renderPhaseUI(ctx, combatTurn) {
    if (combatTurn.selectedPhase.renderUI) {
      combatTurn.selectedPhase.renderUI(ctx);
    }
  }
}
