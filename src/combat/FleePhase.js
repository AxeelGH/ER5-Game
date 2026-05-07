import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";

export default class FleePhase extends CombatPhase {
  constructor(player, enemy, dice, combatTurn, messageQueue) {
    super(player, enemy, dice, combatTurn, messageQueue);
    this.fled = false;
  }

  execute() {
    if (!globals.triedToFlee) {
      const fleeResult = this.dice.evaluateFlee(this.combatTurn.currentTurn);
      globals.triedToFlee = true;
      console.log("Flee result: " + fleeResult);

      if (fleeResult === 1) {

        this.messageQueue.push(new Message("Player fled successfully!"));
        console.log("You fled successfully");

        this.fled = true;

      } else if (fleeResult === 2) {

        this.player.hp -= 5 + this.dice.rollDice(6);
        this.fled = true;

        console.log("You fled but received damage");
        this.messageQueue.push(new Message("Player fled but took damage!"));

      } else {
        
        this.player.hp -= 10 + this.dice.rollDice(6);
        this.fled = false;
        
        console.log("You failed to flee and received damage");
        this.messageQueue.push(new Message("Failed to flee! Took damage."));
      }

      if (this.fled === true) {
        this.echoesOfTheCoward();
      }
    } else {

      this.messageQueue.push(new Message("Cannot flee again! Enemy trapped you."));
      console.log("You already tried to flee and the enemy has trapped you, you can't flee!!");

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

    console.log("Potions: " + globals.inventory.potions);

    if (result === 1) {
      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        if (enemy.isAlive) {
          enemy.maxHp += 20;
          enemy.hp += 20;
        }
      }

      this.messageQueue.push(new Message("Enemies became stronger!"));
      console.log("The enemies have seen you flee and have become more confident; their maximum health has increased!");

    } else if (result === 2) {
      globals.player.maxHp -= 10;
      if (this.player.hp > this.player.maxHp) {
        this.player.hp = this.player.maxHp;
      }

      this.messageQueue.push(new Message("Lost 10 max HP from cowardice!"));
      console.log("Your cowardice has made you lose 10 points of maximum health!");

    } else {
      globals.inventory.removePotion();

      this.messageQueue.push(new Message("Stumbled while fleeing! Lost a potion."));
      console.log("You stumbled while trying to flee and lost a potion!");
    }
  }
}
