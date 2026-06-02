import { EnemyXP, ItemXP } from "../config/constants.js";

export default class XPSystem {

  static getComboBonus(enemyCount) {
    if (enemyCount <= 1) return 1.0;
    if (enemyCount === 2) return 1.1;
    if (enemyCount === 3) return 1.25;
    
    return 1.25 + (enemyCount - 3) * 0.1;
  }

  static getBaseXP(enemy) {
    if (enemy.baseXP !== undefined) {
      return enemy.baseXP;
    }

    switch (enemy.id) {
      case 2: return EnemyXP.SLIME;      
      case 6: return EnemyXP.SLIME;    
      case 3: return EnemyXP.SKELETON;   
      case 8: return EnemyXP.SKELETON;  
      case 4: return EnemyXP.MAGE;      
      case 7: return EnemyXP.MAGE;       
      default: return EnemyXP.SLIME;     
    }
  }

  static xpForKill(enemy, wrathLevel = 1, totalEnemies = 1) {
    let baseXP = this.getBaseXP(enemy);
    let wrathMultiplier = 1.0 + ((wrathLevel - 1) * 0.25);
    let comboMultiplier = this.getComboBonus(totalEnemies);
    
    let totalXP = baseXP * wrathMultiplier * comboMultiplier;
    
    return Math.max(1, Math.round(totalXP));
  }

  static xpForCombat(defeatedEnemies, wrathLevel = 1) {
    let totalCombatXP = 0;
    let numberOfEnemies = defeatedEnemies.length;
    
    for (let i = 0; i < numberOfEnemies; i++) {
      totalCombatXP += this.xpForKill(defeatedEnemies[i], wrathLevel, numberOfEnemies);
    }
    
    return totalCombatXP;
  }

  static xpForItem(item) {
    if (item.xpValue !== undefined) {
      return item.xpValue;
    }

    let itemType = "";
    if (item.type !== undefined) {
      itemType = item.type.toUpperCase();
    }

    if (ItemXP[itemType] !== undefined) {
      return ItemXP[itemType];
    }

    return 0;
  }

}