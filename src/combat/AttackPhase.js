import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";
import { State }from "../config/constants.js";

export default class AttackPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    super(player, enemies, dice, combatTurn, messageQueue);
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
    let playerName = this.player.name || "Player";
    this.messageQueue.push(new Message(playerName + " used Attack!", 'info'));

    if (!this.enemies[this.currentEnemyIndex] || !this.enemies[this.currentEnemyIndex].isAlive) {
      
      let found = false;
      for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].isAlive) {
          this.currentEnemyIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        this.messageQueue.push(new Message("No enemies left!", 'error'));
        this.cancelled = true;
        this.state = "completed";
        return;
      }
    }
  
    let targetEnemy = this.enemies[this.currentEnemyIndex];
    console.log(`Attacking enemy ${this.currentEnemyIndex + 1}`); 
    
    targetEnemy.state = 2;
    targetEnemy.animationTimer = 20;
    this.player.state = State.ATTACK_2;
    this.player.animationTimer = 30;

    let damage = 0;
    let enemyPosition = targetEnemy.combatXIndex;
    let isCritical = Math.random() < 0.1;

    if (isCritical) {
      if (enemyPosition === 2) {
        damage = 22 + 10 + this.dice.rollDice(6) + this.dice.rollDice(6);
        this.messageQueue.push(new Message(targetEnemy.name + " critically hit! It's super effective!", 'critical'));
      } else if (enemyPosition === 1) {
        damage = 16 + 10 + this.dice.rollDice(6);
        this.messageQueue.push(new Message(targetEnemy.name + " critically hit!", 'critical'));
      } else {
        damage = 0;
        this.messageQueue.push(new Message(targetEnemy.name + " missed the attack!", 'error'));
      }
    } else {
      if (enemyPosition === 2) {
        damage = 10 + this.dice.rollDice(6) + this.dice.rollDice(6);
      } else if (enemyPosition === 1) {
        damage = 10 + this.dice.rollDice(6);
      } else {
        damage = 0;
        this.messageQueue.push(new Message(targetEnemy.name + " avoided the attack!", 'move'));
      }
    }

    if (damage > 0) {
      targetEnemy.hp -= damage;
      targetEnemy.hitBlinkTimer = 18;
      if (globals.damageNumbers) globals.damageNumbers.addDamageNumber(damage, 700, 250, false);
      this.messageQueue.push(new Message(targetEnemy.name + " took " + damage + " damage!", 'damage'));

      if (isCritical) {
        this.pushBackEnemy(targetEnemy);
      }

      if (targetEnemy.hp <= 0) {
        targetEnemy.isAlive = false;
        this.messageQueue.push(new Message(targetEnemy.name + " has been slain!", 'info'));
        for (let i = 0; i < globals.map.enemies.length; i++) {
          if (globals.map.enemies[i].id === targetEnemy.id) globals.map.enemies[i].active = false;
        }
        
        let nextAliveIndex = -1;
        for (let i = 0; i < this.enemies.length; i++) {
          if (this.enemies[i].isAlive) {
            nextAliveIndex = i;
            break;
          }
        }
        if (nextAliveIndex !== -1) {
          this.currentEnemyIndex = nextAliveIndex;
        }
      }
    } else if (!isCritical) {
      this.messageQueue.push(new Message("But it failed!", 'error'));
    }

    if (this.player.mana < this.player.maxMana - 5) this.player.mana += 5;
    if (globals.ParticleSystem) globals.ParticleSystem.createExplosion(800, 340, 1.5);
    this.state = "completed";
  }

  pushBackEnemy(enemy) {
    const currentPos = enemy.combatXIndex;
    if (currentPos > 0) {
      const newPos = currentPos - 1;
      
      let positionFree = true;
      for (let i = 0; i < this.enemies.length; i++) {
        const other = this.enemies[i];
        if (other !== enemy && other.isAlive && other.combatXIndex === newPos) {
          positionFree = false;
          break;
        }
      }
      
      if (!positionFree) {
        this.messageQueue.push(new Message(enemy.name + " is blocked by another enemy!", 'error'));
        if (globals.ParticleSystem) {
          globals.ParticleSystem.createExplosion(enemy.combatX, 340, 0.5);
        }
        return;
      }
      
      const positions = [650, 500, 400];
      enemy.combatXIndex = newPos;
      enemy.combatX = positions[newPos];
      this.messageQueue.push(new Message(enemy.name + " was pushed back!", 'move'));
      if (globals.ParticleSystem) {
        globals.ParticleSystem.createExplosion(enemy.combatX, 340, 0.8);
      }
    } else {
      this.messageQueue.push(new Message(enemy.name + " couldn't be pushed back further!", 'info'));
    }
  }

  renderUI(ctx) {
    let aliveCount = 0;
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].isAlive) aliveCount++;
    }
    if (aliveCount <= 1) return;
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
      let enemy = this.enemies[i];
      if (!enemy.isAlive) continue;
      let x = 300 + visibleIndex * 200;
      let isSelected = i === this.currentEnemyIndex;
      ctx.fillStyle = isSelected ? "yellow" : "white";
      ctx.font = isSelected ? "bold 20px alkhemikal" : "20px alkhemikal";
      let enemyType = enemy.id === 2 ? "SLIME" : enemy.id === 3 ? "SKELETON" : "MAGE";
      ctx.fillText(enemy.name + " " + (visibleIndex + 1), x, 480);
      ctx.font = isSelected ? "bold 16px alkhemikal" : "16px alkhemikal";
      ctx.fillStyle = isSelected ? "yellow" : "#cccccc";
      ctx.fillText("HP: " + Math.floor(enemy.hp) + "/" + enemy.maxHp, x, 510);
      visibleIndex++;
    }
    
    ctx.fillStyle = "#88ff88";
    ctx.font = "16px alkhemikal";
    ctx.fillText("Use ← → to select target, SPACE to attack", 500, 540);
  }
}
