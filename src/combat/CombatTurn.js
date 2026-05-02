import globals from "../config/globals.js";
import AttackPhase from "./AttackPhase.js";
import AbilityPhase from "./AbilityPhase.js";
import InventoryPhase from "./InventoryPhase.js";
import FleePhase from "./FleePhase.js";
import MovePhase from "./MovePhase.js";


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
  }


  update() {
    if (this.completed) {
      return;
    }
    if (this.type === "player") {
      this.updatePlayerTurn();
    } else if (this.type === "enemy") {
      this.updateEnemyTurn();
    }
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
    this.state = "selecting";
    this.currentPhaseIndex = 0;
    this.selectedPhase = null;
    globals.triedToFlee = false;
  }

  handlePhaseSelection() {
    if (globals.action.moveUp) {
      globals.action.moveUp = false;
      this.currentPhaseIndex = this.currentPhaseIndex - 1;
      if (this.currentPhaseIndex < 0) {
        this.currentPhaseIndex = this.phases.length - 1;
      }
      console.log("selected: " + this.phases[this.currentPhaseIndex]);
    }
    if (globals.action.moveDown) {
      globals.action.moveDown = false;
      this.currentPhaseIndex = this.currentPhaseIndex + 1;
      if (this.currentPhaseIndex >= this.phases.length) {
        this.currentPhaseIndex = 0;
      }
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
    switch (phaseName) {
      case "Attack":
        return new AttackPhase(this.player, this.enemies, this.dice, this);
      case "Ability":
        return new AbilityPhase(this.player, this.enemies, this.dice, this);
      case "Inventory":
        return new InventoryPhase(this.player, this.enemies, this.dice, this);
      case "Move":
        return new MovePhase(this.player, this.enemies, this.dice, this);
      case "Flee":
        return new FleePhase(this.player, this.enemies, this.dice, this);
      default:
        return new AttackPhase(this.player, this.enemies, this.dice, this);
    }
  }

  updatePhaseExecution() {
    if (!this.selectedPhase) {
      this.state = "selecting";
      return;
    }
    if (this.selectedPhase.state === "waiting") {
      this.selectedPhase.handleInput();
    }
    if (this.selectedPhase.state === "executing") {
      this.selectedPhase.execute();
    }
    if (this.selectedPhase.isFinished()) {
      this.onPhaseComplete();
    }
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
      case "idle":
        this.startEnemyTurn();
        break;
      case "attacking":
        this.executeEnemyAttack();
        break;
      case "finished":
        this.attackExecuted = true;
        this.completed = true;
        break;
    }
  }


  startEnemyTurn() {
    console.log("=== ENEMY (" + this.entity.id + ") ===");
    this.state = "attacking";
    this.animationDelay = 30;
   
    this.entity.state = 1;
    this.entity.animationTimer = 30;
  }


  executeEnemyAttack() {
    if (this.animationDelay > 0) {
      this.animationDelay--;
      return;
    }
   
    const damage = 10 + this.dice.rollDice(6);
    this.player.hp = this.player.hp - damage;
    console.log("Enemy " + damage + " damage: " + this.player.hp + "/" + this.player.maxHp);
   
    if (globals.damageNumbers) {
      globals.damageNumbers.addDamageNumber(damage, 230, 350, true);
    }
   
    if (globals.ParticleSystem) {
      globals.ParticleSystem.createExplosion(230, 340, 0.8);
    }
   
    this.state = "finished";
  }


  isCompleted() {
    return this.completed;
  }


  hasFled() {
    return this.fled;
  }


  getPhaseIndex() {
    return this.currentPhaseIndex;
  }


  getPhaseName() {
    return this.phases[this.currentPhaseIndex];
  }


  getAliveEnemies() {
    const aliveEnemies = [];
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].isAlive) {
        aliveEnemies.push(this.enemies[i]);
      }
    }
    return aliveEnemies;
  }
}
