import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";

export default class AbilityPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    super(player, enemies, dice, combatTurn, messageQueue);
    this.damage = 0;
  }

  execute() {
    let playerName = this.player.name || "Player";
    this.messageQueue.push(new Message(playerName + " used Special Ability!", 'ability'));

    if (this.player.mana >= 20) {
      this.damage = 20 + this.dice.rollDice(6) + this.dice.rollDice(6);
      this.messageQueue.push(new Message("It hit all enemies for " + this.damage + " damage!", 'damage'));
      if (this.damage > 30) this.messageQueue.push(new Message("It's super effective!", 'critical'));


      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        if (enemy.isAlive) {
          enemy.hp -= this.damage;
          globals.gameStats.addStatDamage(this.damage);
          if (globals.damageNumbers) globals.damageNumbers.addDamageNumber(this.damage, 700, 250, false);
          if (enemy.hp <= 0) {
            enemy.isAlive = false;
            this.messageQueue.push(new Message("An enemy fainted!", 'info'));
            for (let j = 0; j < globals.map.enemies.length; j++) {
              if (globals.map.enemies[j].id === enemy.id) globals.map.enemies[j].active = false;
            }
          }
        }
      }

      this.player.mana -= 20;
      if (globals.ParticleSystem) globals.ParticleSystem.createExplosion(580, 340, 1.5);
    } else {
      this.messageQueue.push(new Message("Not enough MP!", 'error'));
      this.cancelled = true;
    }

    this.state = "completed";
  }
}
