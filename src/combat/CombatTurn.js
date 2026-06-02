import globals from "../config/globals.js";
import AttackPhase from "./AttackPhase.js";
import AbilityPhase from "./AbilityPhase.js";
import InventoryPhase from "./InventoryPhase.js";
import FleePhase from "./FleePhase.js";
import MovePhase from "./MovePhase.js";
import { GameState } from "../config/constants.js";
import Message from "./Message.js";

export default class CombatTurn {
  constructor(player, enemies, dice, combat) {
    this.player = player;
    this.enemies = enemies;
    this.dice = dice;
    this.combat = combat;
    this.type = null;
    this.entity = null;
    this.roll = 0;
    this.completed = false;
    this.fled = false;
    this.attackExecuted = false;
    this.state = "idle";
    this.selectedPhase = null;
    this.currentPhaseIndex = 0;
    this.phases = ["Attack", "Ability", "Inventory", "Move", "Flee"];
    this.animationDelay = 0;
    globals.triedToFlee = false;
    this.announceTimer = 0;
    this.pendingAction = null;
  }

  update() {
    if (this.completed) return;
    if (this.type === "player") this.updatePlayerTurn();
    else if (this.type === "enemy") this.updateEnemyTurn();
  }

  updatePlayerTurn() {
    switch (this.state) {
      case "idle": 
        this.startPlayerTurn(); 
        break;
      case "selecting": 
        this.handlePhaseSelection(); 
        break;
      case "executing": 
        this.updatePhaseExecution(); 
        break;
      case "finished": 
        this.completed = true; 
        break;
    }
  }

  startPlayerTurn() {
    console.log("=== Player ===");
    globals.messageQueue.push(new Message("Your turn!", 'info'));
    this.state = "selecting";
    this.currentPhaseIndex = 0;
    this.selectedPhase = null;
    globals.triedToFlee = false;
  }

  handlePhaseSelection() {
    if (globals.action.moveUp) {
      globals.action.moveUp = false;
      this.currentPhaseIndex--;
      if (this.currentPhaseIndex < 0) this.currentPhaseIndex = this.phases.length - 1;
      console.log("selected: " + this.phases[this.currentPhaseIndex]);
    }
    if (globals.action.moveDown) {
      globals.action.moveDown = false;
      this.currentPhaseIndex++;
      if (this.currentPhaseIndex >= this.phases.length) this.currentPhaseIndex = 0;
      console.log("selected: " + this.phases[this.currentPhaseIndex]);
    }
    if (globals.action.confirm) {
      globals.action.confirm = false;
      const phaseName = this.phases[this.currentPhaseIndex];
      this.selectedPhase = this.createPhase(phaseName);
      this.selectedPhase.init();
      this.state = "executing";
      console.log("phase: " + phaseName);
    }
  }

  createPhase(phaseName) {
    let mq = globals.messageQueue;
    switch (phaseName) {
      case "Attack": return new AttackPhase(this.player, this.enemies, this.dice, this, mq);
      case "Ability": return new AbilityPhase(this.player, this.enemies, this.dice, this, mq);
      case "Inventory": return new InventoryPhase(this.player, this.enemies, this.dice, this, mq);
      case "Move": return new MovePhase(this.player, this.enemies, this.dice, this, mq);
      case "Flee": return new FleePhase(this.player, this.enemies, this.dice, this, mq);
      default: return new AttackPhase(this.player, this.enemies, this.dice, this, mq);
    }
  }

  updatePhaseExecution() {
    if (!this.selectedPhase) {
      this.state = "selecting";
      return;
    }
    if (this.selectedPhase.state === "waiting") this.selectedPhase.handleInput();
    if (this.selectedPhase.state === "executing") this.selectedPhase.execute();
    if (this.selectedPhase.isFinished()) this.onPhaseComplete();
  }

  onPhaseComplete() {
    if (this.selectedPhase.cancelled) {
      this.selectedPhase = null;
      this.state = "selecting";
      return;
    }
    if (this.selectedPhase.fled) {
      this.fled = true;
      this.state = "finished";
      return;
    }
    this.selectedPhase = null;
    this.state = "finished";
  }


  updateEnemyTurn() {
    if (!this.entity || !this.entity.isAlive) {
      this.completed = true;
      return;
    }
    if (this.attackExecuted) {
      this.completed = true;
      return;
    }

    switch (this.state) {
      case "idle": this.startEnemyTurn(); break;
      case "deciding": this.decideEnemyAction(); break;
      case "announcing":
        if (this.announceTimer > 0) {
          this.announceTimer--;
        } else {
          if (this.pendingAction === "attack") {
            this.state = "attacking";
            this.animationDelay = 45;
            this.entity.state = 1;
            this.entity.animationTimer = 30;
          } else if (this.pendingAction === "move") {
            this.state = "moving";
            this.prepareEnemyMove();
            this.animationDelay = 45;
          }
        }
        break;
      case "moving": this.executeEnemyMove(); break;
      case "attacking": this.executeEnemyAttack(); break;
      case "finished":
        this.attackExecuted = true;
        this.completed = true;
        break;
    }
  }

  startEnemyTurn() {
    console.log("=== ENEMY (" + this.entity.id + ") ===");
    globals.messageQueue.push(new Message("Enemy's turn!", 'info'));
    this.state = "deciding";
  }

  decideEnemyAction() {
    let action = Math.floor(Math.random() * 2) + 1;
    this.pendingAction = (action === 1) ? "attack" : "move";
    let actionText = (this.pendingAction === "attack") ? "preparing an attack" : "trying to move";
    globals.messageQueue.push(new Message("Wild enemy is " + actionText + "!", 'info'));
    this.state = "announcing";
    this.announceTimer = 60;
  }

  prepareEnemyMove() {
    let currentPos = this.entity.combatXIndex;
    let availablePositions = [];
    
    let neighbors = [];
    if (currentPos > 0) neighbors.push(currentPos - 1);
    if (currentPos < 2) neighbors.push(currentPos + 1);
    
    for (let i = 0; i < neighbors.length; i++) {
      let pos = neighbors[i];
      let occupied = false;
      for (let j = 0; j < this.enemies.length; j++) {
        let other = this.enemies[j];
        if (other !== this.entity && other.isAlive && other.combatXIndex === pos) {
          occupied = true;
          break;
        }
      }
      if (!occupied) availablePositions.push(pos);
    }
    
    if (availablePositions.length === 0) {
      this.targetPositionIndex = currentPos; 
    } else {
      let randomIndex = Math.floor(Math.random() * availablePositions.length);
      this.targetPositionIndex = availablePositions[randomIndex];
    }
  }

  executeEnemyMove() {
    if (this.animationDelay > 0) {
      this.animationDelay--;
      return;
    }
    
    let occupied = false;
    for (let i = 0; i < this.enemies.length; i++) {
      let other = this.enemies[i];
      if (other !== this.entity && other.isAlive && other.combatXIndex === this.targetPositionIndex) {
        occupied = true;
        break;
      }
    }
    
    if (occupied || this.targetPositionIndex === this.entity.combatXIndex) {

      globals.messageQueue.push(new Message("Enemy tried to move but the spot is blocked!", 'error'));
      this.state = "finished";
      return;
    }
    
    const positions = [650, 500, 400];
    this.entity.combatXIndex = this.targetPositionIndex;
    this.entity.combatX = positions[this.targetPositionIndex];
    globals.messageQueue.push(new Message("Enemy moved to the " + this.getPositionName(this.targetPositionIndex) + "!", 'move'));
    if (globals.ParticleSystem) globals.ParticleSystem.createExplosion(this.entity.combatX, 340, 0.5);
    this.state = "finished";
  }

  executeEnemyAttack() {
    if (this.animationDelay > 0) {
      this.animationDelay--;
      return;
    }
    const damageMultiplier = globals.eventWrath.getEnemyDamageMultiplier();
    const playerPosition = this.getPlayerPositionIndex();
    let isCritical = Math.random() < 0.1;
    let damage = 0;

    if (isCritical) {
      if (playerPosition === 0) {
        damage = 0;
        globals.messageQueue.push(new Message("Player avoided the attack!", 'move'));
      } else if (playerPosition === 1) {
        damage = Math.floor((16 + 5 + this.dice.rollDice(6)) * damageMultiplier);
        globals.messageQueue.push(new Message("Critical hit! It's super effective!", 'critical'));
      } else {
        damage = Math.floor((22 + 5 + this.dice.rollDice(6) + this.dice.rollDice(6)) * damageMultiplier);
        globals.messageQueue.push(new Message("Critical hit! It's super effective!", 'critical'));
      }
    } else {
      if (playerPosition === 0) {
        damage = 0;
        globals.messageQueue.push(new Message("Player avoided the attack!", 'move'));
      } else if (playerPosition === 1) {
        damage = Math.floor((5 + this.dice.rollDice(6)) * damageMultiplier);
        globals.messageQueue.push(new Message("Enemy dealt " + damage + " damage!", 'damage'));
      } else {
        damage = Math.floor((5 + this.dice.rollDice(6) + this.dice.rollDice(6)) * damageMultiplier);
        globals.messageQueue.push(new Message("Enemy dealt " + damage + " damage!", 'damage'));
      }
    }

    if (damage > 0) {
      this.player.hp -= damage;
      this.player.hitBlinkTimer = 18;
      if (globals.damageNumbers) globals.damageNumbers.addDamageNumber(Math.floor(damage), 230, 350, true);
      if (globals.ParticleSystem) globals.ParticleSystem.createExplosion(230, 340, isCritical ? 1.5 : 0.8);

      if (isCritical) {
        this.pushBackPlayer();
      }

    } else if (!isCritical) {
      globals.messageQueue.push(new Message("But it failed!", 'error'));
    }
    this.state = "finished";
  }

  pushBackPlayer() {
    const currentPos = this.getPlayerPositionIndex(); 
    if (currentPos > 0) {
      const newPos = currentPos - 1;
      const positions = [100, 300, 500];
      this.player.xPos = positions[newPos];
      globals.messageQueue.push(new Message("Player was pushed back!", 'move'));
      if (globals.ParticleSystem) {
        globals.ParticleSystem.createExplosion(this.player.xPos + 60, 380, 0.8);
      }
    } else {
      globals.messageQueue.push(new Message("Player couldn't be pushed back further!", 'info'));
    }
  }

  getPlayerPositionIndex() {
    if (this.player.xPos === 100) return 0;
    if (this.player.xPos === 450) return 2;
    return 1;
  }

  getPositionName(index) {
    let names = ["back", "middle", "front"];
    return names[index];
  }

  isCompleted() { 
    return this.completed; 
  }

  isFinished() { 
    return this.state === "finished"; 
  }

  getPhaseIndex() { 
    return this.currentPhaseIndex; 
  }
  
  getPhaseName() { 
    return this.phases[this.currentPhaseIndex]; 
  }
  
  getAliveEnemies() {
    const alive = [];
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].isAlive) alive.push(this.enemies[i]);
    }
    return alive;
  }
}