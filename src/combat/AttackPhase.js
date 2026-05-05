import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";

export default class AttackPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn) {
    super(player, enemies, dice, combatTurn);
    this.damage = 0;
    this.currentEnemyIndex = 0;
  }

  handleInput() {
    if (this.state === "waiting") {
      let aliveCount = 0;
      for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].isAlive) aliveCount++;
      }

      if (aliveCount > 1) {
        if (globals.action.moveLeft) {
          globals.action.moveLeft = false;

          let newIndex = this.currentEnemyIndex;
          for (let step = 1; step <= this.enemies.length; step++) {
            let checkIndex = (this.currentEnemyIndex - step + this.enemies.length) % this.enemies.length;
            if (this.enemies[checkIndex].isAlive) {
              newIndex = checkIndex;
              break;
            }
          }
          this.currentEnemyIndex = newIndex;
          console.log(`Targeting enemy ${this.currentEnemyIndex + 1}`);
        }

        if (globals.action.moveRight) {
          globals.action.moveRight = false;

          let newIndex = this.currentEnemyIndex;
          for (let step = 1; step <= this.enemies.length; step++) {
            let checkIndex = (this.currentEnemyIndex + step) % this.enemies.length;
            if (this.enemies[checkIndex].isAlive) {
              newIndex = checkIndex;
              break;
            }
          }
          this.currentEnemyIndex = newIndex;
          console.log(`Targeting enemy ${this.currentEnemyIndex + 1}`);
        }
      }

      if (globals.action.confirm) {
        globals.action.confirm = false;
        this.state = "executing";
      }
    }
  }

  execute() {
  console.log("Executing attack");

  if (!this.enemies[this.currentEnemyIndex].isAlive) {
    let foundAlive = false;
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].isAlive) {
        this.currentEnemyIndex = i;
        foundAlive = true;
        break;
      }
    }
    if (!foundAlive) {
      console.log("No alive enemies to attack!");
      this.cancelled = true;
      this.state = "completed";
      return;
    }
  }

  const targetEnemy = this.enemies[this.currentEnemyIndex];
  if (!targetEnemy.isAlive) {
    console.log("No alive enemies to attack!");
    this.cancelled = true;
    this.state = "completed";
    return;
  }

  targetEnemy.state = 2;
  targetEnemy.animationTimer = 20;

  this.player.state = 4;
  this.player.animationTimer = 30;

  let damage = 0;
  let enemyPosition = targetEnemy.combatXIndex;

  if (enemyPosition === 0) {
    damage = 10 + this.dice.rollDice(6) + this.dice.rollDice(6);
    console.log("Enemy in LEFT position: Full damage!");
  } else if (enemyPosition === 1) {
    damage = 10 + this.dice.rollDice(6);
    console.log("Enemy in CENTER position: Normal damage");
  } else {
    damage = 0;
    console.log("Enemy in RIGHT position: No damage!");
  }
  
  this.damage = damage;

  if (this.damage > 0) {
    targetEnemy.hp -= this.damage;
    
    if (globals.damageNumbers) {
      globals.damageNumbers.addDamageNumber(this.damage, 700, 250, false);
    }
    
    console.log(`Damage to enemy ${this.currentEnemyIndex + 1}: ${this.damage}`);
  } else {
    console.log("Attack missed! No damage dealt.");
    if (globals.damageNumbers) {
      globals.damageNumbers.addDamageNumber(0, 700, 250, false);
    }
  }

  if (this.player.mana < this.player.maxMana - 5) {
    this.player.mana += 5;
  }

  if (globals.ParticleSystem) {
    const explosionX = 800;
    const explosionY = 340;
    globals.ParticleSystem.createExplosion(explosionX, explosionY, 1.5);
  }

  if (targetEnemy.hp <= 0) {
    targetEnemy.isAlive = false;
    console.log(`Enemy ${this.currentEnemyIndex + 1} defeated`);
  }

  this.state = "completed";
}

  renderUI(ctx) {
    let aliveCount = 0;
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].isAlive) aliveCount++;
    }

    if (aliveCount <= 1) return; //

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(200, 400, 600, 150);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(200, 400, 600, 150);

    ctx.fillStyle = "white";
    ctx.font = "24px alkhemikal";
    ctx.textAlign = "center";
    ctx.fillText("SELECT TARGET:", 500, 440);

    let visibleIndex = 0;
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (!enemy.isAlive) continue;

      const x = 300 + visibleIndex * 200;
      const isSelected = i === this.currentEnemyIndex;

      if (isSelected) {
        ctx.fillStyle = "yellow";
        ctx.font = "bold 20px alkhemikal";
      } else {
        ctx.fillStyle = "white";
        ctx.font = "20px alkhemikal";
      }

      const enemyType = enemy.id === 2 ? "SLIME" : enemy.id === 3 ? "SKELETON" : "MAGE";
      ctx.fillText(`${enemyType} ${visibleIndex + 1}`, x, 480);

      ctx.font = isSelected ? "bold 16px alkhemikal" : "16px alkhemikal";
      ctx.fillStyle = isSelected ? "yellow" : "#cccccc";
      ctx.fillText(`HP: ${Math.floor(enemy.hp)}/${enemy.maxHp}`, x, 510);

      visibleIndex++;
    }

    ctx.fillStyle = "#88ff88";
    ctx.font = "16px alkhemikal";
    ctx.fillText("Use ← → to select target, SPACE to attack", 500, 540);
  }
}
