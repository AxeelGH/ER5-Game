import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class InventoryPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn) {
    super(player, enemies, dice, combatTurn);
}

  execute() {
    console.log("use item");

    if (globals.inventory && globals.inventory.getPotions() > 0) {
      globals.inventory.usePotion(this.player);
      console.log("You used a potion, gained 30 HP");
      this.cancelled = true;
    } else {
      console.log("No potions available!");
      this.cancelled = true;
    }

    this.state = "completed";
  }
}
