import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";

export default class FleePhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    super(player, enemies, dice, combatTurn, messageQueue);
    this.fled = false;
  }

  execute() {
    if (!globals.triedToFlee) {
      let fleeResult = this.dice.evaluateFlee(this.combatTurn.currentTurn);
      globals.triedToFlee = true;
      if (fleeResult === 1) {
        this.messageQueue.push(new Message("You manage to slip away from the enemy's grasp. You're safe... for now.", 'flee'));
        this.fled = true;
        globals.gameStats.registerFlee();
      } else if (fleeResult === 2) {
        this.player.hp -= 5 + this.dice.rollDice(6);
        this.messageQueue.push(new Message("You escape, but not without a scratch! The enemy lands a parting blow.", 'flee'));
        let playerName = this.player.name || "Player";
        this.messageQueue.push(new Message(playerName + " is hurt by the recoil!", 'damage'));
        this.fled = true;
        globals.gameStats.registerFlee();
      } else {
        this.player.hp -= 10 + this.dice.rollDice(6);
        this.messageQueue.push(new Message("You try to flee, but you trip over your own feet! The enemy takes advantage.", 'error'));
        this.messageQueue.push(new Message("Can't escape!", 'error'));
        this.messageQueue.push(new Message("The enemy blocked the way!", 'error'));
        this.fled = false;
        globals.gameStats.registerFailedFlee();
      }
      if (this.fled) this.echoesOfTheCoward();
    } else {
      this.messageQueue.push(new Message("Cannot flee again! The enemy trapped you!", 'error'));
      this.cancelled = true;
    }
    this.state = "completed";
  }

  echoesOfTheCoward() {
    let result;
    if (globals.inventory.potions >= 1) {
      result = Math.floor(Math.random() * 3) + 1;
    } else {
      result = Math.floor(Math.random() * 2) + 1;
    }
    if (result === 1) {
      for (let i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        if (enemy.isAlive) {
          enemy.maxHp += 20;
          enemy.hp += 20;
        }
      }
      this.messageQueue.push(new Message("Enemies became stronger!", 'info'));
    } else if (result === 2) {
      globals.player.maxHp -= 10;
      if (this.player.hp > this.player.maxHp) this.player.hp = this.player.maxHp;
      this.messageQueue.push(new Message("Lost 10 max HP from cowardice!", 'error'));
    } else {
      globals.inventory.removePotion();
      this.messageQueue.push(new Message("Stumbled while fleeing! Lost a potion.", 'error'));
    }
  }
}