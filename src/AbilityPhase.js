import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class AbilityPhase extends CombatPhase {
  constructor(player, enemy, dice, combatTurn) {
    super(player, enemy, dice, combatTurn);
    this.damage = 0;
  }

  execute() {
    console.log("Executing ability");

    this.player.state = 4;
    this.player.animationTimer = 30;

    if (this.player.mana >= 20) {
      this.damage = 20 + this.dice.rollDice(6) + this.dice.rollDice(6);
      this.enemy.hp -= this.damage;
      globals.damageNumbers.addDamageNumber(this.damage,700,250, false);
      this.player.mana -= 20;

      console.log("Damage: " + this.damage);

      if (globals.ParticleSystem) {
        const explosionX = 580;
        const explosionY = 340;
        globals.ParticleSystem.createExplosion(explosionX, explosionY, 1.5);
      }
    } else {
      console.log("Not enough mana to use ability");
      this.cancelled = true;
    }

    if (this.enemy.hp <= 0) {
      this.enemy.isAlive = false;
      console.log("Enemy defeated");
    }

    this.state = "completed";
  }
}
