import Dice from "./Dice.js";
import SuperSlime from "../sprites/SuperSlime.js";
import SuperMage from "../sprites/SuperMage.js";
import SuperSkeleton from "../sprites/SuperSkeleton.js";
import globals from "../config/globals.js";
import { SpriteID, CombatState, GameState } from "../config/constants.js";
import CombatTurn from "./CombatTurn.js";
import Message from "./Message.js";

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
    this.assignCombatPositions();
  }

  create(player, enemies) {
    this.player = player;
    this.enemies = enemies;
    this.combatSprites(player, enemies);
    this.orderTurn(player, enemies);
  }

  update(combatState) {
    if (globals.messageQueue) globals.messageQueue.update();

    switch (combatState) {
      case CombatState.INIT_COMBAT:
        this.initCombat();
        break;
      case CombatState.PLAY_TURN:
        this.playTurn();
        break;
      case CombatState.END_COMBAT:
        console.log("Combat finished");
        break;
    }
  }

  assignCombatPositions() {
    const positionX = [650, 500, 400]; 
    const enemiesAlive = [];
    
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].isAlive) enemiesAlive.push(this.enemies[i]);
    }

    if (enemiesAlive.length === 1) {
      enemiesAlive[0].combatXIndex = 1;
      enemiesAlive[0].combatX = positionX[1];
    } else {

      for (let i = 0; i < enemiesAlive.length; i++) {
        let indexPosition = i % 3;
        enemiesAlive[i].combatXIndex = indexPosition;
        enemiesAlive[i].combatX = positionX[indexPosition];
      }
    }
  }

  combatSprites(player, enemies) {
    this.player = player;
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      if (enemy.id === SpriteID.SLIME) enemy.superSprite = new SuperSlime(0, 0);
      else if (enemy.id === SpriteID.MAGE) enemy.superSprite = new SuperMage(0, 0);
      else if (enemy.id === SpriteID.SKELETON) enemy.superSprite = new SuperSkeleton(0, 0);
    }
  }

  orderTurn(player, enemies) {
    this.turns = [];
    let playerTurn = new CombatTurn(player, enemies, this.dice, this);
    playerTurn.type = "player";
    playerTurn.roll = this.dice.rollDice(6);
    playerTurn.completed = false;
    this.turns.push(playerTurn);
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      if (enemy.isAlive) {
        let enemyTurn = new CombatTurn(player, enemies, this.dice, this);
        enemyTurn.type = "enemy";
        enemyTurn.entity = enemy;
        enemyTurn.roll = this.dice.rollDice(6);
        enemyTurn.completed = false;
        this.turns.push(enemyTurn);
      }
    }
    for (let i = 0; i < this.turns.length - 1; i++) {
      for (let j = i + 1; j < this.turns.length; j++) {
        if (this.turns[j].roll > this.turns[i].roll) {
          let temp = this.turns[i];
          this.turns[i] = this.turns[j];
          this.turns[j] = temp;
        }
      }
    }
    if (this.turns[0].type === "player") {
      globals.messageQueue.push(new Message("You go first!", 'info'));
    } else {
      globals.messageQueue.push(new Message("Enemy attacks first!", 'info'));
    }
  }

  initCombat() {
    let enemyName = this.enemies[0] ? (this.enemies[0].name || "wild enemy") : "wild enemy";
    globals.messageQueue.push(new Message("A wild " + enemyName + " appeared!", 'info'));
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
      let currentTurn = this.turns[i];
      if (currentTurn.completed) continue;
      if (currentTurn.type === "enemy" && currentTurn.attackExecuted) {
        this.currentTurnIndex = i;
        this.waitingForEnemyAttack = true;
        this.enemyAttackTimer = 60;   //enemy timer
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
      let allDead = true;
      for (let j = 0; j < this.enemies.length; j++) {
        if (this.enemies[j].isAlive) {
          allDead = false;
          break;
        }
      }
      if (allDead) {
        this.endCombat(false);
        return;
      }
    }
    this.startNewRound();
  }

  startNewRound() {
    this.currentRound++;
    globals.messageQueue.push(new Message("Round " + this.currentRound + "!", 'info'));
    
    for (let i = 0; i < this.turns.length; i++) {
      let turn = this.turns[i];
      turn.completed = false;
      if (turn.type === "enemy") turn.attackExecuted = false;
      turn.state = "idle";
    }
    this.currentTurnIndex = 0;
    this.waitingForEnemyAttack = false;
    this.enemyAttackTimer = 0;
  }

  endCombat(playerDied) {
    globals.messageQueue.clear();
    if (playerDied) {
      globals.messageQueue.push(new Message((this.player.name || "Player") + " blacked out!", 'error'));
      if (globals.gameInstance) {
        globals.gameInstance.combat = null;
        globals.gameInstance.gameState = GameState.GAME_OVER;
      }
      globals.gameState = GameState.GAME_OVER;
    } else {
      globals.messageQueue.push(new Message("You won the battle!", 'info'));
      globals.messageQueue.push(new Message("Got " + (100 * this.enemies.length) + " experience!", 'info'));

      if (globals.gameInstance && globals.gameInstance.backupPlayer) {
      const original = globals.gameInstance.backupPlayer;

      original.hp = Math.min(original.maxHp, Math.ceil(this.player.hp / 2));
      original.mana = Math.min(original.maxMana, Math.ceil(this.player.mana / 2));

      globals.player = original;
      globals.gameInstance.backupPlayer = null;
    }
      if (globals.gameInstance) {
        for (let i = 0; i < this.enemies.length; i++) {
          let enemy = this.enemies[i];
          if (!enemy.isAlive) {
            globals.gameStats.registerKill();
            globals.gameInstance.addEnemyProgress();
          }
        }
      }
      let manaGain = 10 * this.enemies.length;
      this.player.mana = this.player.mana + manaGain;
      if (this.player.mana > this.player.maxMana) this.player.mana = this.player.maxMana;
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