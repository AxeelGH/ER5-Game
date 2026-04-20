import globals from './globals.js';

export default class Map {
    constructor(id, name, mapData, imageSet, enemies = []) {
        this.id = id;
        this.name = name;
        this.data = mapData;
        this.imageSet = imageSet;
        this.enemies = enemies;
        this.isCompleted = false;
        this.levels = [];
        this.currentLevelIndex = 0;
    }

    getEnemies() {
        return this.enemies;
    }

    getMapData() {
        return this.data;
    }
    
    setEnemies(enemies) {
        this.enemies = enemies;
    }
    
    addLevel(level) {
        this.levels.push(level);
    }
    
    getLevel(index) {
        return this.levels[index];
    }
    
    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }
    
    setCurrentLevel(index) {
        this.currentLevelIndex = index;
        let level = this.levels[index];
        if (level) {
            this.data = level.data;
            this.enemies = level.enemies;
            this.name = level.name;
        }
    }
    
    loadNextLevel() {
        if (this.currentLevelIndex + 1 < this.levels.length) {
            this.currentLevelIndex++;
            let nextLevel = this.levels[this.currentLevelIndex];
            this.data = nextLevel.data;
            this.enemies = nextLevel.enemies;
            this.name = nextLevel.name;
            return true;
        }
        return false;
    }

    loadPreviousLevel() {
        if (this.currentLevelIndex - 1 >= 0) {
            this.currentLevelIndex--;
            let prevLevel = this.levels[this.currentLevelIndex];
            this.data = prevLevel.data;
            this.enemies = prevLevel.enemies;
            this.name = prevLevel.name;
            return true;
        }
        return false;
    }
}