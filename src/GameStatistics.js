export default class GameStatistics {
  constructor(playerId) {
    this.sessionId = crypto.randomUUID();
    this.playerId = playerId;
    this.startedAt = new Date(Date.now()).toISOString().replace('T',' ').replace('Z','');

    this.gamesPlayed = 0;
    this.consumedPotions = 0; 
    this.enemiesKilled = 0;
    this.wins = 0;
    this.losses = 0;
    this.highScore = 0;
    this.totalXP = 0;         
  }

  registerGamePlayed() {
    this.gamesPlayed++;
  }
  
  registerKill() {
    this.enemiesKilled++;
  }

  registerConsumedPotion() {
    this.consumedPotions++;
  }

  registerXPGained(amount) {
    this.totalXP += amount;
  }

  registerWin(score) {
    this.wins++;
    this.updateHighScore(score);
  }

  registerLoss(score) {
    this.losses++;
    this.updateHighScore(score);
  }

  updateHighScore(score) {
    if (score > this.highScore) {
      this.highScore = score;
    }
  }

  toPayload() {
    return { ...this };
  }
}