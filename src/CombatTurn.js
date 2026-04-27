import globals from "./globals.js";
import Dice from "./Dice.js";
import AbilityPhase from "./AbilityPhase.js";
import AttackPhase from "./AttackPhase.js";
import InventoryPhase from "./InventoryPhase.js";
import FleePhase from "./FleePhase.js";
import { GameState } from "./constants.js";
import SpriteFactory from "./SpriteFactory.js";

export default class CombatTurn {
  dice = new Dice();
  constructor(player, enemy, input) {
    this.player = player;
    this.enemy = enemy;
    this.input = input;

    this.currentPhase = null;
    this.turnEnd = false;
    this.currentTurn = 1;
    globals.triedToFlee = false;
    this.waitingForPlayer = false;

    //Combat index
    this.phaseIndex = 0;
    this.phases = ["Attack", "Ability", "Inventory", "Flee"];

    this.initPhases();
    this.startCombat();
  }

  initPhases() {
    this.combatPhases = {
      Attack: new AttackPhase(this.player, this.enemy, this.input, this.dice),
      Ability: new AbilityPhase(this.player, this.enemy, this.input, this.dice),
      Inventory: new InventoryPhase(this.player, this.enemy, this.input, this.dice),
      Flee: new FleePhase(this.player, this.enemy, this.input, this.dice),
    };
  }

  combatMenu() {
    if (!this.waitingForPlayer) {
      return;
    }

    if (this.currentTurn === 1 && !this.combatStarted) {
      this.startCombat();
    }
    if (globals.action.moveUp) {
      globals.action.moveUp = false;
      this.phaseIndex = this.phaseIndex > 0 ? this.phaseIndex - 1 : this.phases.length - 1;
    }
    if (globals.action.moveDown) {
      globals.action.moveDown = false;
      this.phaseIndex = this.phaseIndex < this.phases.length - 1 ? this.phaseIndex + 1 : 0;
    }

    if (globals.action.confirm) {
      globals.action.confirm = false;

      const selectedPhase = this.phases[this.phaseIndex];
      console.log("Selected phase: " + selectedPhase);

      this.currentPhase = this.combatPhases[selectedPhase];
      console.log("Turn: " + this.currentTurn);
      this.executePhase();
    }
  }

  startCombat() {
    const playerNum = this.dice.rollDice(6);
    const enemyNum = this.dice.rollDice(6);

    console.log("Player num: " + playerNum);
    console.log("Enemy num: " + enemyNum);

    if (enemyNum > playerNum) {
      console.log("The enemy got a higher roll and attacks first!");
      this.enemyTurn();
      this.waitingForPlayer = true;
    } else {
      console.log("The player got a higher roll and goes first!");
      this.waitingForPlayer = true;
    }
  }

  executePhase() {
    this.waitingForPlayer = false;
    this.currentPhase.execute();

    if (this.currentPhase.cancelled) {
      this.waitingForPlayer = true;
      return;
    }

    if (this.currentPhase.fled) {
      this.endCombat();
      return;
    }

    if (!this.enemy.isAlive) {
      this.endCombat();
      this.player.mana += 10;
      globals.gameInstance.score += 100;

      const dropChance = 0.3;
      const randomValue = Math.random();

      if (randomValue < dropChance && globals.inventory) {
        this.createPotionDrop();
        //globals.inventory.addPotion();
        console.log("dropped a potion");
      } else {
        console.log("No item dropped");
      }

      return;
    }
    this.enemyTurn();
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

  endCombat() {
    globals.currentEnemy = null;
    globals.gameInstance.combatTurn = null;
    globals.gameInstance.gameState = GameState.PLAYING;
    globals.gameState = GameState.PLAYING;
  }

  enemyTurn() {
    this.enemy.state = 1;
    this.enemy.animationTimer = 60;

    const damage = 10 + this.dice.rollDice(6);

    this.player.hp -= damage;

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      globals.gameInstance.combatTurn = null;
      globals.gameInstance.gameState = GameState.GAME_OVER;
      globals.gameState = GameState.GAME_OVER;
    }
    this.nextTurn();
  }

  finishTurn() {
    this.turnEnd = true;
  }

  nextTurn() {
    this.currentPhase = null;
    this.currentTurn += 1;
    this.waitingForPlayer = true;
    this.initPhases();
  }
}
