import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";

export default class InventoryPhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    super(player, enemies, dice, combatTurn, messageQueue);
  }

  execute() {
    if (globals.inventory && globals.inventory.getPotions() > 0) {
      globals.inventory.usePotion(this.player);
      let playerName = this.player.name || "Player";
      this.messageQueue.push(new Message(playerName + " used Potion!", 'heal'));
      this.messageQueue.push(new Message(playerName + " restored 30 HP!", 'heal'));
      globals.gameStats.registerConsumedPotion();
      this.cancelled = true;
    } else {
      this.messageQueue.push(new Message("But there are no potions left!", 'error'));
      this.cancelled = true;
    }
    this.state = "completed";
  }
}