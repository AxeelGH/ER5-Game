export default class EventWrath {
  constructor() {
    this.name = "The Scholar's Wrath";
    this.level = 1;
    this.progress = 0;
    this.thresholdLevel2 = 100;
    this.cinematicShown = false;
  }

  addProgress(amount) {
    const oldLevel = this.level;
    this.progress += amount;
    console.log(`[EventWrath] Progress: ${this.progress}/100 (Nivel ${this.level}`);
    
    if (this.progress >= this.thresholdLevel2 && this.level === 1) {
      this.level = 2;
      this.cinematicShown = false;
      console.log("[EventWrath] ===== SUBE A NIVEL 2 =====");
    }
    
    return oldLevel !== this.level;
  }

  getEnemyHpMultiplier() {
    switch(this.level) {
      case 1: 
        return 1.0;
      case 2: 
        return 1.3;
      default: 
        return 1.0;
    }
  }

  getEnemyDamageMultiplier() {
    switch(this.level) {
      case 1: 
        return 1.0;
      case 2: 
        return 1.1;
      default: 
        return 1.0;
    }
  }

  getExtraEnemyCount() {
    switch(this.level) {
      case 1: 
        return 0;
      case 2: 
        return 1;
      default: 
        return 0;
    }
  }

  getEnemySpawnChance() {
    switch(this.level) {
      case 1: 
        return 0;
      case 2: 
        return 0.003;
      default: 
        return 0;
    }
  }

  getAvailableEnemyTypes() {
    switch(this.level) {
      case 1:
        return ["slime"];
      case 2:
        return ["slime", "skeleton"];
      default:
        return ["slime"];
    }
  }

  getCinematicMessage() {
    if (this.level === 2 && !this.cinematicShown) {
      return {
        title: "SCHOLAR'S WRATH - LEVEL 2",
        message: "The darkness intensifies!\nEnemies grow stronger and more numerous.\nTheir health and damage have increased!\nNew enemies may appear unexpectedly...",
        sound: "level2_alert"
      };
    }
    return null;
  }

  needsCinematic() {
    return false;
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