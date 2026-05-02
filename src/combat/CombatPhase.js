import globals from "../config/globals.js";

export default class CombatPhase {
  constructor(player, enemies, dice, combatTurn) {
    this.player = player;
    this.enemies = enemies;
    this.dice = dice;
    this.combatTurn = combatTurn;
    this.state = "init";
    this.result = null;
    this.cancelled = false;
    this.fled = false;
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