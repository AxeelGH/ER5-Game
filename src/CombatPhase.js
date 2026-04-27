import globals from "./globals.js";

export default class CombatPhase {
  constructor(player, enemy, dice, combatTurn) {
    this.player = player;
    this.enemy = enemy;
    this.dice = dice;
    this.combatTurn = combatTurn;
    
    this.state = 'init';
    this.result = null;
    this.cancelled = false;
    this.fled = false;
  }

  init() {
    this.state = 'waiting';
  }

  handleInput() {
    if (this.state === 'waiting') {
      this.state = 'executing';
    }
  }

  execute() {
    this.state = 'completed';
  }

  onComplete() {
  }

  renderUI(ctx) {
  }

  isFinished() {
    return this.state === 'completed' || this.state === 'cancelled';
  }
}