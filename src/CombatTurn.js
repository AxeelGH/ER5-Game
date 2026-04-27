import globals from "./globals.js";
import Dice from "./Dice.js";
import AbilityPhase from "./AbilityPhase.js";
import AttackPhase from "./AttackPhase.js";
import InventoryPhase from "./InventoryPhase.js";
import FleePhase from "./FleePhase.js";
import MovePhase from "./MovePhase.js";
import { GameState } from "./constants.js";
import SpriteFactory from "./SpriteFactory.js";

export default class CombatTurn {
  constructor(player, enemy, input) {
    this.player = player;
    this.enemy = enemy;
    this.input = input;
    this.dice = new Dice();
    
    // States: starting, selecting, executing, enemy_turn, finished
    this.state = 'starting';
    this.selectedPhase = null;
    this.currentTurn = 1;
    this.currentPhaseIndex = 0;
    this.phases = ["Attack", "Ability", "Inventory", "Move", "Flee"];
    
    globals.triedToFlee = false;
    
    this.startCombat();
  }

  startCombat() {
    const playerNum = this.dice.rollDice(6);
    const enemyNum = this.dice.rollDice(6);

    console.log("Player roll: " + playerNum);
    console.log("Enemy roll: " + enemyNum);

    if (enemyNum > playerNum) {
      console.log("The enemy attacks first!");
      this.state = 'enemy_turn';
    } else {
      console.log("The player goes first!");
      this.state = 'selecting';
    }
  }

  update() {
    switch(this.state) {
      case 'selecting':
        this.handlePhaseSelection();
        break;
      case 'executing':
        this.updatePhaseExecution();
        break;
      case 'enemy_turn':
        this.executeEnemyTurn();
        break;
      case 'finished':
        break;
    }
  }

  handlePhaseSelection() {
    if (globals.action.moveUp) {
      globals.action.moveUp = false;
      this.currentPhaseIndex = (this.currentPhaseIndex - 1 + this.phases.length) % this.phases.length;
    }
    
    if (globals.action.moveDown) {
      globals.action.moveDown = false;
      this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.phases.length;
    }

    if (globals.action.confirm) {
      globals.action.confirm = false;
      const phaseName = this.phases[this.currentPhaseIndex];
      this.selectedPhase = this.createPhase(phaseName);
      this.selectedPhase.init();
      this.state = 'executing';
    }
  }

  createPhase(phaseName) {
    switch(phaseName) {
      case "Attack":
        return new AttackPhase(this.player, this.enemy, this.dice, this);
      case "Ability":
        return new AbilityPhase(this.player, this.enemy, this.dice, this);
      case "Inventory":
        return new InventoryPhase(this.player, this.enemy, this.dice, this);
      case "Move":
        return new MovePhase(this.player, this.enemy, this.dice, this);
      case "Flee":
        return new FleePhase(this.player, this.enemy, this.dice, this);
      default:
        return new AttackPhase(this.player, this.enemy, this.dice, this);
    }
  }

  updatePhaseExecution() {
    if (!this.selectedPhase) {
      this.state = 'selecting';
      return;
    }
    
    if (this.selectedPhase.state === 'waiting') {
      this.selectedPhase.handleInput();
    }
    
    if (this.selectedPhase.state === 'executing') {
      this.selectedPhase.execute();
    }
    
    if (this.selectedPhase.isFinished()) {
      this.onPhaseComplete();
    }
  }

  onPhaseComplete() {

    if (this.selectedPhase.cancelled) {
      this.selectedPhase = null;
      this.state = 'selecting';
      return;
    }
    
    if (this.selectedPhase.fled) {
      this.endCombat();
      return;
    }
    
    if (this.selectedPhase.onComplete) {
      this.selectedPhase.onComplete();
    }
    this.selectedPhase = null;
    
    // Verificate if enemi is alive
    if (!this.enemy.isAlive) {
      this.handleEnemyDefeated();
      return;
    }
    
    this.state = 'enemy_turn';
  }

  handleEnemyDefeated() {
    console.log("Enemy defeated!");
    this.player.mana += 10;
    globals.gameInstance.score += 100;

    const dropChance = 0.3;
    if (Math.random() < dropChance && globals.inventory) {
      this.createPotionDrop();
      console.log("A potion dropped!");
    }

    this.endCombat();
  }

  createPotionDrop() {
    const dropX = this.enemy.xPos + 20;
    const dropY = this.enemy.yPos + 20;

    const potion = SpriteFactory.createItem(dropX, dropY);

    if (!globals.potionDrops) {
      globals.potionDrops = [];
    }
    globals.potionDrops.push(potion);
    console.log("Potion dropped at: " + dropX + ", " + dropY);
  }

  executeEnemyTurn() {
    console.log("Enemy turn!");
    
    this.enemy.state = 1;
    this.enemy.animationTimer = 60;
    
    const damage = 10 + this.dice.rollDice(6);
    this.player.hp -= damage;
    console.log("Enemy deals " + damage + " damage!");
    
    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.endCombat(true);
      return;
    }
    
    this.nextTurn();
  }

  nextTurn() {
    this.currentTurn++;
    this.currentPhaseIndex = 0;
    this.selectedPhase = null;
    this.state = 'selecting';
    console.log("=== Turn " + this.currentTurn + " ===");
  }

  endCombat(playerDied = false) {
    if (playerDied) {
      globals.gameInstance.combatTurn = null;
      globals.gameInstance.gameState = GameState.GAME_OVER;
      globals.gameState = GameState.GAME_OVER;
    } else {
      globals.currentEnemy = null;
      globals.gameInstance.combatTurn = null;
      globals.gameInstance.gameState = GameState.PLAYING;
      globals.gameState = GameState.PLAYING;
    }
    this.state = 'finished';
  }

  isFinished() {
    return this.state === 'finished';
  }

  getPhaseIndex() {
    return this.currentPhaseIndex;
  }

  getPhaseName() {
    return this.phases[this.currentPhaseIndex];
  }
}