import Map from "./Map.js";
import ImageSet from "../sprites/ImageSet.js";
import SpriteFactory from "../sprites/SpriteFactory.js";
import globals from "../config/globals.js";
import { mapLayouts } from "./levels.js";

export default class LevelFactory {
  constructor() {
    this.levels = [];
    this.enemyData = [];
    this.itemData = [];
    this.currentLevelIndex = 0;
  }

  async loadLevels(mapDataPath) {
    await this.loadEnemies();
    await this.loadItems();

    const response = await fetch("./src/config/mapData.json");
    const data = await response.json();

    for (let i = 0; i < data.maps.length; i++) {
      let level = this.createLevel(data.maps[i]);
      this.levels.push(level);
    }
    console.log("loading levels...", this.levels.length);
  }

  async loadEnemies() {
    const response = await fetch("./src/config/enemyData.json");
    const data = await response.json();
    this.enemyData = data;
    console.log("Enemies loaded:", this.enemyData);
  }

  async loadItems() {
    const response = await fetch("./src/config/itemData.json");
    const data = await response.json();
    this.itemData = data;
    console.log("Items loaded:", this.itemData);
  }

  getLevelById(levelId) {
    let foundLevel = null;

    for (let i = 0; i < this.levels.length; i++) {
      if (this.levels[i].id === levelId) {
        foundLevel = this.levels[i];
        break;
      }
    }

    return foundLevel;
  }

  createLevel(mapConfig) {
    let mapImageSet = new ImageSet(0, 0, 32, 32, 0, 0, 32);

    let mapData = this.getMapDataForLevel(mapConfig.id);

    let enemies = this.createEnemiesFromConfig(mapConfig.enemies);

    let items = this.createItemsFromConfig(mapConfig.items);

    let level = new Map(mapConfig.id, mapConfig.name, mapData, mapImageSet, enemies, items);

    return level;
  }

  createItemsFromConfig(itemsConfig) {
    let items = [];

    for (let i = 0; i < itemsConfig.length; i++) {
      let config = itemsConfig[i];
      let itemId = config.id;
      let itemBaseData = null;

      for (let j = 0; j < this.itemData.items.length; j++) {
        if (this.itemData.items[j].id === itemId) {
          itemBaseData = this.itemData.items[j];
          break;
        }
      }

      let item = null;
      
      if (itemBaseData.type === "collectable") {
        item = SpriteFactory.createCollectable(config.xPos, config.yPos);
      } else if (itemBaseData.type === "sword") {
        item = SpriteFactory.createSword(config.xPos, config.yPos);
      } else {
        item = SpriteFactory.createItem(config.xPos, config.yPos);
      }

      if (item) {
        item.type = itemBaseData.type;
        items.push(item);
      }
    }
    return items;
  }

  createEnemiesFromConfig(enemiesConfig) {
    let enemies = [];
    
    // Posiciones predefinidas para distribución en el mapa
    const availablePositions = [
      { x: 200, y: 300 },   // Posición izquierda
      { x: 400, y: 340 },   // Posición centro
      { x: 570, y: 610 },   // Posición derecha
      { x: 300, y: 450 },   // Posición extra 1
      { x: 480, y: 420 },   // Posición extra 2
      { x: 160, y: 300 },   // Posición extra 3
      { x: 500, y: 500 }    // Posición extra 4
    ];
    
    let positionIndex = 0;

    for (let i = 0; i < enemiesConfig.length; i++) {
      let config = enemiesConfig[i];
      let enemyId = config.id;
      let enemyStats = null;

      for (let j = 0; j < this.enemyData.enemies.length; j++) {
        if (this.enemyData.enemies[j].id === enemyId) {
          enemyStats = this.enemyData.enemies[j];
          break;
        }
      }

      let spawnCount = config.spawnCount || 1;
      
      for (let i = 0; i < spawnCount; i++) {
        let enemy = null;
        
        let x, y;
        
        if (positionIndex < availablePositions.length) {
          x = availablePositions[positionIndex].x;
          y = availablePositions[positionIndex].y;
          positionIndex++;
        } else {
          x = config.xPos + (i * 80);
          y = config.yPos;
        }

        if (enemyStats.type === "slime") {
          enemy = SpriteFactory.createSlime(x, y);
        } else if (enemyStats.type === "skeleton") {
          enemy = SpriteFactory.createSkeleton(x, y);
        } else if (enemyStats.type === "mage") {
          enemy = SpriteFactory.createMage(x, y);
        }

        if (enemy && enemyStats.hp) {
          const difficultyMultiplier = globals.difficulty === "hard" ? 1.2 : 1;
          enemy.hp = enemyStats.hp * difficultyMultiplier;
          enemy.maxHp = enemyStats.hp * difficultyMultiplier;
        }

        if (enemy) {
          enemy.name = enemyStats.name;
          if (spawnCount > 1) {
            const suffixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];
            enemy.name = enemyStats.name + " " + (suffixes[i] || (i + 1));
          }
          enemies.push(enemy);
        }
      }
    }

    console.log("Created", enemies.length, "enemies at different positions");
    return enemies;
  }

  getMapDataForLevel(levelId) {
    return mapLayouts[levelId] || mapLayouts[1];
  }
}