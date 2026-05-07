export default class GameStatistics {
  constructor(playerId) {
    this.sessionId = crypto.randomUUID();
    this.playerId = playerId;
    this.startedAt = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');
    this.finishedAt = null;

    this.enemiesKilled = 0;
    this.damageDone = 0;
    this.damageTaken = 0;
    this.successfulFlees = 0;
    this.failedFlees = 0;
    this.consumedPotions = 0;

    this.finalScore = 0;
    this.result = null; // Victory|Defeat|Abandoned
    this.levelReached = -1;
  }

  registerKill() {
    this.enemiesKilled++;
  }
  registerFlee() {
    this.successfulFlees++;
  }
  registerFailedFlee() {
    this.failedFlees++;
  }
  addStatDamage(amount) {
    this.damageDone += amount;
  }
  takenStatDamage(amount) {
    this.damageTaken += amount;
  }
  registerConsumedPotion() {
    this.consumedPotions++;
  }

  finish(result, score) {
    this.finishedAt = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');
    this.result = result;
    this.finalScore = score;
  }

  toPayload() {
    return { ...this };
  }
}
