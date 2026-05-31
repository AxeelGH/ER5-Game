export default class EventWrath {
  constructor(config) {
    this.name = "The Scholar's Wrath";
    this.level = 1;
    this.progress = 0;
    this.cinematicShown = false;

    this.thresholdLevel2 = config.thresholdLevel2 || 100;
    this.thresholdLevel3 = config.thresholdLevel3 || 250;
    this.progressPerEnemy = config.progressPerEnemy || 20;
    this.progressPerScreen = config.progressPerScreen || 10;
    this.progressPerItem = config.progressPerItem || 20;
  }

  addProgress(amount) {
    const oldLevel = this.level;
    this.progress += amount;
    console.log("[EventWrath] Progress: " + this.progress + "/" + this.thresholdLevel3 + " (Level " + this.level + ")");

    if (this.progress >= this.thresholdLevel2 && this.level === 1) {
      this.level = 2;
      this.cinematicShown = false;
      console.log("[EventWrath] ===== UPGRADE TO LEVEL 2 =====");
    } else if (this.progress >= this.thresholdLevel3 && this.level === 2) {
      this.level = 3;
      this.cinematicShown = false;
      console.log("[EventWrath] ===== UPGRADE TO LEVEL 3 =====");
    }

    return oldLevel !== this.level;
  }

  getEnemyHpMultiplier() {
    switch(this.level) {
      case 1: return 1.0;
      case 2: return 1.3;
      case 3: return 1.8;
      default: return 1.0;
    }
  }

  getEnemyDamageMultiplier() {
    switch(this.level) {
      case 1: return 1.0;
      case 2: return 1.1;
      case 3: return 1.4;
      default: return 1.0;
    }
  }

  getExtraEnemyCount() {
    switch(this.level) {
      case 1: return 0;
      case 2: return 1;
      case 3: return 2;
      default: return 0;
    }
  }

  getEnemySpawnChance() {
    switch(this.level) {
      case 1: return 0;
      case 2: return 0.003;
      case 3: return 0.008;
      default: return 0;
    }
  }

  getAvailableEnemyTypes() {
    switch(this.level) {
      case 1: return ["slime"];
      case 2: return ["slime", "skeleton"];
      case 3: return ["slime", "skeleton", "mage"];
      default: return ["slime"];
    }
  }

  getCinematicMessage() {
    if (this.level === 2 && !this.cinematicShown) {
      return {
        title: "SCHOLAR'S WRATH - LEVEL 2",
        message: "The darkness intensifies!\nEnemies grow stronger and more numerous.",
        sound: "level2_alert"
      };
    } else if (this.level === 3 && !this.cinematicShown) {
      return {
        title: "SCHOLAR'S WRATH - LEVEL 3",
        message: "The ancient evil awakens!\nNew enemies appear!",
        sound: "level3_alert"
      };
    }
    return null;
  }

  markCinematicShown() { 
    this.cinematicShown = true; 
  }
  reset() { 
    this.level = 1; 
    this.progress = 0; 
    this.cinematicShown = false; 
  }
}