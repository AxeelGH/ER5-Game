import globals from "./globals.js";
import { SpriteID, State } from "./constants.js";
import SuperSlime from "./SuperSlime.js";
import SuperMage from "./SuperMage.js";
import SuperSkeleton from "./SuperSkeleton.js";

export default class CombatView {
  constructor(ctx) {
    this.ctx = ctx;
    
    // Crear instancias de Super enemigos solo para renderizado
    this.superSlime = new SuperSlime(0, 0);
    this.superMage = new SuperMage(0, 0);
    this.superSkeleton = new SuperSkeleton(0, 0);
  }

  render() {
    const enemy = globals.currentEnemy;
    const player = globals.player;
    
    if (enemy) {
      enemy.combatUpdate();
    }
    if (player) {
      player.combatUpdate();
      player.updateAnimationFrame();
    }

    // Renderizar enemigo con su versión Super correspondiente
    if (enemy) {
      if (enemy.id === SpriteID.SLIME) {
        this.updateSuperEnemy(this.superSlime, enemy);
        this.drawEnemy(this.superSlime, 450, 160, 500, 500);
      } else if (enemy.id === SpriteID.MAGE) {
        this.updateSuperEnemy(this.superMage, enemy);
        this.drawEnemy(this.superMage, 450, 130, 500, 500);
      } else if (enemy.id === SpriteID.SKELETON) {
        this.updateSuperEnemy(this.superSkeleton, enemy);
        this.drawEnemy(this.superSkeleton, 450, 160, 500, 500);
      } else if (enemy.id === SpriteID.SUPER_SLIME) {
        this.drawEnemy(enemy, 450, 160, 500, 500);
      } else if (enemy.id === SpriteID.SUPER_MAGE) {
        this.drawEnemy(enemy, 450, 130, 500, 500);
      } else if (enemy.id === SpriteID.SUPER_SKELETON) {
        this.drawEnemy(enemy, 450, 160, 500, 500);
      } else {
        this.drawEnemy(enemy, 300, 100, 700, 700);
      }
    }

    if (player) {
      this.drawPlayer(player, 80, 120, 500, 500);
    }
  }

  updateSuperEnemy(superEnemy, normalEnemy) {
    // Sincronizar el timer
    superEnemy.animationTimer = normalEnemy.animationTimer;
    
    // Mapear el estado del enemigo normal al estado del Super enemigo
    if (normalEnemy.id === SpriteID.SLIME) {
      if (normalEnemy.state === 0) {
        superEnemy.state = State.SUPER_SLIME_STILL; // 0 - Quieto
      } else if (normalEnemy.state === 1) {
        superEnemy.state = State.SUPER_SLIME_MOVE;
      } else if (normalEnemy.state === 2) {
        superEnemy.state = State.SUPER_SLIME_ATTACK;
        console.log("Attack")
      }
    } else if (normalEnemy.id === SpriteID.MAGE) {
      if (normalEnemy.state === 0) {
        superEnemy.state = State.SUPER_MAGE_STILL; // 0 - Quieto
      } else if (normalEnemy.state === 1) {
        superEnemy.state = State.SUPER_MAGE_ATTACK; // 1 - Atacando
      } else if (normalEnemy.state === 2) {
        superEnemy.state = State.SUPER_MAGE_HIT; // 2 - Recibiendo daño
      }
    } else if (normalEnemy.id === SpriteID.SKELETON) {
      if (normalEnemy.state === 0) {
        superEnemy.state = State.SUPER_SKELETON_STILL; // 0 - Quieto
      } else if (normalEnemy.state === 1) {
        superEnemy.state = State.SUPER_SKELETON_ATTACK; // 1 - Atacando
      } else if (normalEnemy.state === 2) {
        superEnemy.state = State.SUPER_SKELETON_HIT; // 2 - Recibiendo daño
      }
    }
    
    // Actualizar los frames del Super enemigo usando SU PROPIA configuración
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

    // Usar el estado actual del enemigo para la fila del spritesheet
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
}