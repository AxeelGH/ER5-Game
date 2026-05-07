import Dice from "./Dice.js";
import SuperSlime from "../sprites/SuperSlime.js";
import SuperMage from "../sprites/SuperMage.js";
import SuperSkeleton from "../sprites/SuperSkeleton.js";
import globals from "../config/globals.js";
import { SpriteID, CombatState, GameState } from "../config/constants.js";
import CombatTurn from "./CombatTurn.js";

export default class Combat {
  constructor(player, enemies) {
    this.player = player;
    this.enemies = enemies;
    this.dice = new Dice();
    this.turns = [];
    this.currentTurnIndex = 0;
    this.currentRound = 1;
    this.state = CombatState.INIT_COMBAT;
    this.waitingForEnemyAttack = false;
    this.enemyAttackTimer = 0;
    this.combatSprites(player, enemies);
    this.orderTurn(player, enemies);
  }

  create(player, enemies) {
    this.player = player;
    this.enemies = enemies;
    this.combatSprites(player, enemies);
    this.orderTurn(player, enemies);
  }

  update(combatState) {
    switch (combatState) {
      case CombatState.INIT_COMBAT:
        console.log("Combat Start");
        this.initCombat();
        break;
      case CombatState.PLAY_TURN:
        this.playTurn();
        break;
      case CombatState.END_COMBAT:
        console.log("Combat finished");
        break;
      default:
        break;
    }
  }

  combatSprites(player, enemies) {
    this.player = player;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.id === SpriteID.SLIME) {
        enemy.superSprite = new SuperSlime(0, 0);
      } else if (enemy.id === SpriteID.MAGE) {
        enemy.superSprite = new SuperMage(0, 0);
      } else if (enemy.id === SpriteID.SKELETON) {
        enemy.superSprite = new SuperSkeleton(0, 0);
      }
    }
  }

  orderTurn(player, enemies) {
    this.turns = [];
    
    const playerTurn = new CombatTurn(player, enemies, this.dice, this);
    playerTurn.type = "player";
    playerTurn.roll = this.dice.rollDice(6);
    playerTurn.completed = false;
    this.turns.push(playerTurn);
    
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].isAlive) {
        const enemyTurn = new CombatTurn(player, enemies, this.dice, this);
        enemyTurn.type = "enemy";
        enemyTurn.entity = enemies[i];
        enemyTurn.roll = this.dice.rollDice(6);
        enemyTurn.completed = false;
        this.turns.push(enemyTurn);
      }
    }
    
    for (let i = 0; i < this.turns.length - 1; i++) {
      for (let j = i + 1; j < this.turns.length; j++) {
        if (this.turns[j].roll > this.turns[i].roll) {
          const temp = this.turns[i];
          this.turns[i] = this.turns[j];
          this.turns[j] = temp;
        }
      }
    }
    
    console.log("=== Turn ===");
    for (let i = 0; i < this.turns.length; i++) {
      console.log(i + 1 + ": " + this.turns[i].type + " (roll: " + this.turns[i].roll + ")");
    }
  }

  initCombat() {
    this.state = CombatState.PLAY_TURN;
    globals.combatState = CombatState.PLAY_TURN;
    this.currentTurnIndex = 0;
    this.waitingForEnemyAttack = false;
    this.enemyAttackTimer = 0;
  }

  playTurn() {
    if (this.waitingForEnemyAttack) {
      this.enemyAttackTimer--;
      if (this.enemyAttackTimer <= 0) {
        this.waitingForEnemyAttack = false;
        this.currentTurnIndex++;
      }
      return;
    }
    
    for (let i = this.currentTurnIndex; i < this.turns.length; i++) {
      const currentTurn = this.turns[i];
      
      if (currentTurn.completed) {
        continue;
      }
      
      if (currentTurn.type === "enemy" && currentTurn.attackExecuted) {
        this.currentTurnIndex = i;
        this.waitingForEnemyAttack = true;
        this.enemyAttackTimer = 40;
        return;
      }
      
      currentTurn.update();
      
      if (!currentTurn.completed) {
        this.currentTurnIndex = i;
        return;
      }
      
      if (currentTurn.fled) {
        this.endCombat(false);
        return;
      }
      
      if (this.player.hp <= 0) {
        this.endCombat(true);
        return;
      }
      
      let allEnemiesDead = true;
      for (let j = 0; j < this.enemies.length; j++) {
        if (this.enemies[j].isAlive) {
          allEnemiesDead = false;
          break;
        }
      }
      
      if (allEnemiesDead) {
        this.endCombat(false);
        return;
      }
    }
    
    this.startNewRound();
  }

  startNewRound() {
    this.currentRound++;
    console.log("=== ROUND " + this.currentRound + " ===");
    
    for (let i = 0; i < this.turns.length; i++) {
      this.turns[i].completed = false;
      if (this.turns[i].type === "enemy") {
        this.turns[i].attackExecuted = false;
      }
      this.turns[i].state = "idle";
    }
    
    this.currentTurnIndex = 0;
    this.waitingForEnemyAttack = false;
    this.enemyAttackTimer = 0;
  }

  endCombat(playerDied) {
    this.state = CombatState.END_COMBAT;
    globals.combatState = CombatState.END_COMBAT;
    
    if (playerDied) {
      console.log("=== DEFEAT ===");
      if (globals.gameInstance) {
        globals.gameInstance.combat = null;
        globals.gameInstance.gameState = GameState.GAME_OVER;
      }
      globals.gameState = GameState.GAME_OVER;
    } else {
      console.log("=== WIN ===");
      if (globals.gameInstance) {
        for (let i = 0; i < this.enemies.length; i++) {
          if (!this.enemies[i].isAlive) {
            globals.gameInstance.addEnemyProgress();
          }
        }
      }
      
      this.player.mana = this.player.mana + 10 * this.enemies.length;
      if (this.player.mana > this.player.maxMana) {
        this.player.mana = this.player.maxMana;
      }
      if (globals.gameInstance) {
        globals.gameInstance.score += 100 * this.enemies.length;
        globals.gameInstance.combat = null;
        globals.gameInstance.gameState = GameState.PLAYING;
      }
      globals.gameState = GameState.PLAYING;
    }
    
    globals.currentEnemy = null;
    globals.currentEnemies = null;
  }
}