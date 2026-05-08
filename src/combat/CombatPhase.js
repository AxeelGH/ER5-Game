import globals from "../config/globals.js";
import Message from "./Message.js";

export default class CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    this.player = player;
    this.enemies = enemies;
    this.dice = dice;
    this.combatTurn = combatTurn;
    this.state = "init";
    this.result = null;
    this.cancelled = false;
    this.fled = false;
    this.messageQueue = messageQueue;
  }

  init() {
    this.state = "waiting";
  }

  handleInput() {
    if (this.state === "waiting" && globals.action.confirm) {
      globals.action.confirm = false;
      this.state = "executing";
    }
  }

  execute() {
    this.state = "completed";
  }

  onComplete() {}

  renderUI(ctx) {}

  isFinished() {
    return this.state === "completed" || this.cancelled;
  }
}