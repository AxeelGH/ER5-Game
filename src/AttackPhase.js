import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class AttackPhase extends CombatPhase {
  constructor(player, enemy, dice, combatTurn) {
    super(player, enemy, dice, combatTurn);
    this.damage = 0;
  }

  execute() {
    console.log("Executing attack");

    this.enemy.state = 2;
    this.enemy.animationTimer = 20;

    this.player.state = 4;
    this.player.animationTimer = 30;

    this.damage = 10 + this.dice.rollDice(6) + this.dice.rollDice(6);
    this.enemy.hp -= this.damage;
    globals.damageNumbers.addDamageNumber(this.damage, 700, 250, false);

    if (this.player.mana < this.player.maxMana - 5) {
      this.player.mana += 5;
    }

    console.log("Damage: " + this.damage);

    if (globals.ParticleSystem) {
      const explosionX = 800;
      const explosionY = 340;
      globals.ParticleSystem.createExplosion(explosionX, explosionY, 1.5);
    }

    if (this.enemy.hp <= 0) {
      this.enemy.isAlive = false;
      console.log("Enemy defeated");
    }

    this.state = "completed";
  }
}
