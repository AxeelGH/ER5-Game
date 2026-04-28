import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";

export default class AbilityPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn) {
    super(player, enemies, dice, combatTurn);
    this.damage = 0;
  }

  execute() {
    console.log("Executing ability");

    this.player.state = 4;
    this.player.animationTimer = 30;

    if (this.player.mana >= 20) {
      this.damage = 20 + this.dice.rollDice(6) + this.dice.rollDice(6);
      
      // Damage to all enemies
      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        if (enemy.isAlive) {
          enemy.hp -= this.damage;
          
          if (globals.damageNumbers) {
            globals.damageNumbers.addDamageNumber(this.damage, 700, 250, false);
          }
          
          console.log(`Damage to enemy: ${this.damage}`);
          
          if (enemy.hp <= 0) {
            enemy.isAlive = false;
            console.log("Enemy defeated");
          }
        }
      }
      
      this.player.mana -= 20;

      if (globals.ParticleSystem) {
        const explosionX = 580;
        const explosionY = 340;
        globals.ParticleSystem.createExplosion(explosionX, explosionY, 1.5);
      }
    } else {
      console.log("Not enough mana to use ability");
      this.cancelled = true;
    }

    this.state = "completed";
}
}