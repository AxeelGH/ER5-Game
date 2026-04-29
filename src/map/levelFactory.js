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

    let enemiesData = mapConfig.enemies ? mapConfig.enemies : this.enemyData;

    let itemsData = mapConfig.items ? mapConfig.items : this.itemData;

    let enemies = this.createEnemiesFromConfig(enemiesData);

    let items = this.createItemsFromConfig(itemsData);

    let level = new Map(mapConfig.id, mapConfig.name, mapData, mapImageSet, enemies, items);

    return level;
  }

  createItemsFromConfig(itemsConfig) {
    let items = [];

    for (let i = 0; i < itemsConfig.length; i++) {
      let itemId = itemsConfig[i];
      let itemData = null;

      for (let j = 0; j < this.itemData.items.length; j++) {
        if (this.itemData.items[j].id === itemId) {
          itemData = this.itemData.items[j];
          break;
        }
      }

      let item = null;

      item = SpriteFactory.createItem(itemData.xPos, itemData.yPos);

      items.push(item);
      console.log("Created ", items.length, " items");
    }
    return items;
  }

  createEnemiesFromConfig(enemiesConfig) {
    let enemies = [];

    for (let i = 0; i < enemiesConfig.length; i++) {
      let enemyId = enemiesConfig[i];
      let enemyData = null;

      for (let j = 0; j < this.enemyData.enemies.length; j++) {
        if (this.enemyData.enemies[j].id === enemyId) {
          enemyData = this.enemyData.enemies[j];
          break;
        }
      }

      let enemy = null;

      if (enemyData.type === "slime") {
        enemy = SpriteFactory.createSlime(enemyData.xPos, enemyData.yPos);
      } else if (enemyData.type === "skeleton") {
        enemy = SpriteFactory.createSkeleton(enemyData.xPos, enemyData.yPos);
      } else if (enemyData.type === "mage") {
        enemy = SpriteFactory.createMage(enemyData.xPos, enemyData.yPos);
      }

      if (enemy && enemyData.hp) {
        enemy.hp = enemyData.hp;
        enemy.maxHp = enemyData.hp;
      }

      if (enemy) {
        enemies.push(enemy);
      }
    }

    console.log("Created", enemies.length, "enemies");
    return enemies;
  }

  getMapDataForLevel(levelId) {
    return mapLayouts[levelId] || mapLayouts[1];
  }
}
