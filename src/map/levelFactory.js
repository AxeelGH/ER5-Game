import Map from "./Map.js";
import ImageSet from "../ImageSet.js";
import SpriteFactory from "../sprites/SpriteFactory.js";
import globals from "../config/globals.js";

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
    let mapLayouts = {

                      0: [
    [1501,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1502,1503,1504,1505,1506],
    [1601,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1606],
    [1601,2,1501,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1504,1506,2,1606],
    [1601,2,1601,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1606,2,1606],
    [1601,2,1601,20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,18,1606,2,1606],
    [1601,2,1601,27,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,25,1606,2,1606],
    [1601,2,1601,27,3,7,9,9,9,9,9,9,9,9,9,10,3,7,9,9,9,9,9,9,9,9,10,3,25,1606,2,1606],
    [1601,2,1601,27,3,25,2,2,2,20,22,22,22,22,22,24,3,21,22,22,22,22,18,2,2,2,17,3,25,1606,2,1606],
    [1601,2,1601,27,3,25,2,2,2,27,3,3,3,3,3,3,3,3,3,3,3,3,25,2,2,2,27,3,25,1606,2,1606],
    [1601,2,1601,27,3,25,2,2,2,27,3,7,8,8,8,8,8,8,8,8,10,3,25,2,2,2,27,3,25,1606,2,1606],
    [1601,2,1601,27,3,25,2,2,2,27,3,25,30,31,31,31,31,31,31,32,27,3,21,22,22,22,24,3,25,1606,2,1606],
    [1601,2,1601,27,3,25,2,2,2,27,3,25,75,5,5,5,5,5,5,72,27,3,3,3,3,3,3,3,25,1606,2,1606],
    [1601,2,1601,27,3,21,22,22,22,24,3,25,75,5,5,5,5,5,5,72,27,3,7,9,9,9,9,9,11,1606,2,1606],
    [1601,2,1601,27,3,3,3,3,3,3,3,25,75,5,5,5,5,5,5,72,27,3,25,2,2,2,2,2,2,1606,2,1606],
    [1601,2,1601,13,8,8,8,8,8,10,3,25,75,5,5,5,5,5,5,72,27,3,25,2,2,2,2,2,2,1606,2,1606],
    [1601,2,1601,2,2,2,2,2,2,27,3,25,75,5,5,5,5,5,5,72,27,3,25,2,2,2,2,2,2,1606,2,1606],
    [1601,2,1601,2,2,2,2,2,2,27,3,25,42,43,43,43,43,43,43,44,27,3,25,2,2,2,2,2,2,1606,2,1606],
    [1601,2,1601,20,22,22,22,22,22,24,3,21,23,23,23,23,23,23,23,23,24,3,21,23,23,23,23,23,18,1606,2,1606],
    [1601,2,1601,27,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,25,1606,2,1606],
    [1601,2,1601,13,8,9,9,8,8,8,8,8,8,8,8,10,7,9,9,9,9,9,9,9,9,9,9,9,11,1606,2,1606],
    [1601,2,1601,2,2,2,2,2,2,2,2,2,2,2,2,1703,1704,2,2,2,2,2,2,2,2,2,2,2,2,1606,2,1606],
    [1601,2,1801,1805,1805,1805,1805,1805,1805,1805,1805,1805,1805,1805,1805,1803,1804,1805,1805,1805,1805,1805,1805,1805,1805,1805,1805,1805,1805,1806,2,1606],
    [1601,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1703,1704,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1706],
    [1801,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1803,1804,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1802,1806]
        ],
        1: [
    [2,1501,1505,1505,1505,1505,1505,1505,1505,1505,1505,1505,1505,1607,27,3,25,1608,1505,1506,2,2,2,1501,1505,1505,1505,1505,1505,1505,1505,1505],
    [2,1601,2,2,2,2,2,2,2,2,2,2,2,2,27,3,25,2,2,1606,2,2,2,1601,2,2,2,2,2,2,2,2],
    [2,1601,2,2,2,2,2,2,2,2,2,2,2,2,27,3,25,2,2,1606,2,2,2,1601,2,2,2,2,2,2,2,2],
    [2,1601,2,2,20,22,22,22,22,22,22,22,22,22,24,3,25,2,2,1606,2,2,2,1601,2,2,20,22,22,22,22,22],
    [2,1601,2,2,27,3,3,3,3,3,3,3,3,3,3,3,25,2,2,1606,2,2,2,1601,2,2,27,3,3,3,3,3],
    [2,1601,2,2,27,3,7,8,8,8,8,8,8,8,8,8,11,2,2,1608,1504,1504,1504,1607,2,2,27,3,7,8,8,8],
    [2,1601,2,2,27,3,25,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,27,3,25,35,77,77],
    [2,1601,2,2,27,3,25,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,27,3,25,75,5,5],
    [2,1601,2,2,27,3,25,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,27,3,25,75,5,5],
    [2,1601,2,2,27,3,21,22,22,22,22,22,22,22,22,22,22,22,22,22,18,2,2,2,2,2,27,3,25,75,5,5],
    [2,1601,2,2,27,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,25,2,2,2,2,2,27,3,25,75,5,5],
    [2,1601,2,2,27,3,7,8,8,8,8,8,8,8,8,8,8,8,10,3,25,2,2,2,2,2,27,3,25,75,5,5],
    [1502,1607,2,2,27,3,25,35,77,77,77,77,77,77,77,77,77,34,27,3,21,22,22,22,22,22,24,3,25,75,5,5],
    [2,2,2,2,27,3,25,75,5,5,5,5,5,5,5,5,5,72,27,3,3,3,3,3,3,3,3,3,25,75,5,5],
    [2,2,2,2,27,3,25,75,5,5,5,5,5,5,5,5,5,72,48,49,8,8,8,8,8,8,10,3,25,75,5,5],
    [35,77,77,77,27,3,25,79,5,5,5,5,5,5,5,5,5,76,53,54,77,77,77,77,77,34,27,3,25,75,5,5],
    [42,70,70,70,27,3,25,70,70,70,70,71,5,68,70,70,70,70,58,59,70,70,71,5,5,72,27,3,25,75,5,5],
    [2,2,2,2,13,8,11,2,2,2,2,75,5,72,2,2,2,2,2,2,2,2,75,5,5,72,27,3,25,75,5,5],
    [2,2,2,2,2,2,2,2,2,2,2,75,5,72,2,2,2,2,2,2,2,2,75,5,5,72,27,3,25,75,5,5],
    [2,2,2,2,2,2,2,2,2,2,2,1101,1102,1103,2,2,2,2,2,2,2,2,75,5,5,72,27,3,25,42,69,69],
    [2,2,2,2,2,2,2,2,2,2,2,1201,1202,1203,2,2,2,2,2,2,2,2,75,5,5,72,27,3,21,22,22,22],
    [2,2,2,2,2,2,2,2,2,2,2,1301,1302,1303,2,2,2,2,2,2,2,2,75,5,5,72,27,3,3,3,3,3],
    [2,2,2,2,2,2,2,2,2,2,2,75,5,72,2,2,2,2,2,2,2,2,75,5,5,72,13,8,8,8,8,8],
    [2,2,2,2,2,2,2,2,2,2,2,75,5,76,77,77,77,77,77,77,77,77,79,5,5,76,78,78,78,78,78,78]
],

    };

    return mapLayouts[levelId] || mapLayouts[1];
  }
}
