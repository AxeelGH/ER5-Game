import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";

export default class InventoryPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    super(player, enemies, dice, combatTurn, messageQueue);
  }

  execute() {
    console.log("use item");

    if (globals.inventory && globals.inventory.getPotions() > 0) {
      globals.inventory.usePotion(this.player);
      this.cancelled = true;

      this.messageQueue.push(new Message("Player uses a potion! Gained 30 HP."));
      console.log("You used a potion, gained 30 HP");
      
      this.cancelled = true;
      globals.gameStats.registerConsumedPotion();
      
    } else {

      this.cancelled = true;

      this.messageQueue.push(new Message("No potions available!"));
      console.log("No potions available!");
      
    }
    console.log("Consumed potions: " + globals.gameStats.consumedPotions);
    this.state = "completed";
  }
}
