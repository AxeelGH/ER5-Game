import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class AttackPhase extends CombatPhase {
  handleSelection() {}

  performAction() {
    console.log("Executing attack");

    this.enemy.state = 2;
    this.enemy.animationTimer = 20;

    this.player.state = 4;
    this.player.animationTimer = 30;

    const damage = 10 + this.dice.rollDice(6) + this.dice.rollDice(6);
    this.enemy.hp -= damage;
    if (this.player.mana < this.player.maxMana - 5) {
      this.player.mana += 5;
    }

    console.log("Damage: " + damage);

    if (globals.ParticleSystem) {
      const explosionX = 800;
      const explosionY = 340;
      const intensity = Math.min(1.0, damage / 40);
      globals.ParticleSystem.createExplosion(explosionX, explosionY, 1.5);
    }

    this.state = "resolve";
  }

  resolve() {
    console.log("Resolving attack");

    if (this.enemy.hp <= 0) {
      this.enemy.isAlive = false;
      console.log("Enemy defeated");
    }

    this.state = "end";
  }
}
