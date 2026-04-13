import globals from './globals.js';
import { GameState, SpriteID } from './constants.js';
import CombatTurn from './CombatTurn.js';

export default class CollisionManager {
    
    static getSolidTileIds() {
        return [
            30,31,32,34,35,36,38,42,43,44,68,69,70,71,72,75,76,77,78,79
        ];
    }
    
    static getMapTileId(xPos, yPos) {
        const map = globals.map;
        if (!map || !map.data) return 0;
        
        const brickSize = map.imageSet.gridSize;
        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);
        
        if (fil < 0 || fil >= map.data.length || col < 0 || col >= map.data[0].length) {
            return -1;
        }
        
        return map.data[fil][col];
    }
    
    static isCollidingWithObstacleAt(xPos, yPos) {
        const tileId = this.getMapTileId(xPos, yPos);
        if (tileId === -1) return true;
        const solidTiles = this.getSolidTileIds();
        return solidTiles.includes(tileId);
    }
    
    static detectCollisionWithMap(sprite) {
        if (!sprite || !sprite.hitBox) return false;
        
        const points = [
            { x: sprite.xPos + sprite.hitBox.xOffset, y: sprite.yPos + sprite.hitBox.yOffset },
            { x: sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1, y: sprite.yPos + sprite.hitBox.yOffset },
            { x: sprite.xPos + sprite.hitBox.xOffset, y: sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1 },
            { x: sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1, y: sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1 },
            { x: sprite.xPos + sprite.hitBox.xOffset + Math.floor(sprite.hitBox.xSize / 2), y: sprite.yPos + sprite.hitBox.yOffset },
            { x: sprite.xPos + sprite.hitBox.xOffset + Math.floor(sprite.hitBox.xSize / 2), y: sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1 },
            { x: sprite.xPos + sprite.hitBox.xOffset, y: sprite.yPos + sprite.hitBox.yOffset + Math.floor(sprite.hitBox.ySize / 2) },
            { x: sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1, y: sprite.yPos + sprite.hitBox.yOffset + Math.floor(sprite.hitBox.ySize / 2) }
        ];
        
        for (let point of points) {
            if (this.isCollidingWithObstacleAt(point.x, point.y)) {
                return true;
            }
        }
        return false;
    }
    
    static resolveMapCollision(sprite) {
        if (!sprite || !sprite.hitBox) return;
        
        const brickSize = globals.map.imageSet.gridSize;
        const deltaTime = globals.deltaTime || 1/60;
        
        sprite.isCollidingWithObstacleOnTheBottom = false;
        
        if (sprite.physics.vx > 0) {
            let xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
            let yPos = sprite.yPos + sprite.hitBox.yOffset;
            let isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = Math.floor(xPos) % brickSize + 1;
                let overlapY = brickSize - Math.floor(yPos) % brickSize;
                if (overlapX <= overlapY) {
                    sprite.xPos -= overlapX;
                    sprite.physics.vx = 0;
                } else {
                    sprite.yPos += overlapY;
                    sprite.physics.vy = 0;
                }
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
            yPos = sprite.yPos + sprite.hitBox.yOffset + Math.floor(sprite.hitBox.ySize / 2);
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = Math.floor(xPos) % brickSize + 1;
                sprite.xPos -= overlapX;
                sprite.physics.vx = 0;
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
            yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = Math.floor(xPos) % brickSize + 1;
                let overlapY = Math.floor(yPos) % brickSize + 1;
                if (overlapX <= overlapY) {
                    sprite.xPos -= overlapX;
                    sprite.physics.vx = 0;
                } else {
                    sprite.yPos -= overlapY;
                    sprite.isCollidingWithObstacleOnTheBottom = true;
                    sprite.physics.vy = 0;
                }
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset;
            yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapY = Math.floor(yPos) % brickSize + 1;
                sprite.yPos -= overlapY;
                sprite.isCollidingWithObstacleOnTheBottom = true;
                sprite.physics.vy = 0;
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset;
            yPos = sprite.yPos + sprite.hitBox.yOffset + Math.floor(sprite.hitBox.ySize / 2);
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = brickSize - Math.floor(xPos) % brickSize;
                sprite.xPos += overlapX;
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset;
            yPos = sprite.yPos + sprite.hitBox.yOffset;
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapY = brickSize - Math.floor(yPos) % brickSize;
                sprite.yPos += overlapY;
                sprite.physics.vy = 0;
            }
        }
        else if (sprite.physics.vx < 0) {
            let xPos = sprite.xPos + sprite.hitBox.xOffset;
            let yPos = sprite.yPos + sprite.hitBox.yOffset;
            let isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = brickSize - Math.floor(xPos) % brickSize;
                let overlapY = brickSize - Math.floor(yPos) % brickSize;
                if (overlapX <= overlapY) {
                    sprite.xPos += overlapX;
                    sprite.physics.vx = 0;
                } else {
                    sprite.yPos += overlapY;
                    sprite.physics.vy = 0;
                }
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset;
            yPos = sprite.yPos + sprite.hitBox.yOffset + Math.floor(sprite.hitBox.ySize / 2);
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = brickSize - Math.floor(xPos) % brickSize;
                sprite.xPos += overlapX;
                sprite.physics.vx = 0;
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset;
            yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = brickSize - Math.floor(xPos) % brickSize;
                let overlapY = Math.floor(yPos) % brickSize + 1;
                if (overlapX <= overlapY) {
                    sprite.xPos += overlapX;
                    sprite.physics.vx = 0;
                } else {
                    sprite.yPos -= overlapY;
                    sprite.isCollidingWithObstacleOnTheBottom = true;
                    sprite.physics.vy = 0;
                }
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
            yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapY = Math.floor(yPos) % brickSize + 1;
                sprite.yPos -= overlapY;
                sprite.isCollidingWithObstacleOnTheBottom = true;
                sprite.physics.vy = 0;
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
            yPos = sprite.yPos + sprite.hitBox.yOffset + Math.floor(sprite.hitBox.ySize / 2);
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapX = Math.floor(xPos) % brickSize + 1;
                sprite.xPos -= overlapX;
            }
            
            xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
            yPos = sprite.yPos + sprite.hitBox.yOffset;
            isColliding = this.isCollidingWithObstacleAt(xPos, yPos);
            
            if (isColliding) {
                let overlapY = brickSize - Math.floor(yPos) % brickSize;
                sprite.yPos += overlapY;
                sprite.physics.vy = 0;
            }
        }
        else {
            const isFalling = sprite.physics.vy > 0;
            
            if (isFalling) {
                let xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
                let yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
                let isColliding1 = this.isCollidingWithObstacleAt(xPos, yPos);
                
                xPos = sprite.xPos + sprite.hitBox.xOffset;
                yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
                let isColliding2 = this.isCollidingWithObstacleAt(xPos, yPos);
                
                if (isColliding1 || isColliding2) {
                    let minOverlapY = Infinity;
                    
                    if (isColliding1) {
                        xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
                        yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
                        let overlapY = Math.floor(yPos) % brickSize + 1;
                        minOverlapY = Math.min(minOverlapY, overlapY);
                    }
                    if (isColliding2) {
                        xPos = sprite.xPos + sprite.hitBox.xOffset;
                        yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize - 1;
                        let overlapY = Math.floor(yPos) % brickSize + 1;
                        minOverlapY = Math.min(minOverlapY, overlapY);
                    }
                    
                    sprite.yPos -= minOverlapY;
                    sprite.isCollidingWithObstacleOnTheBottom = true;
                    sprite.physics.vy = 0;
                }
            }
            else if (sprite.physics.vy < 0) {
                let xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
                let yPos = sprite.yPos + sprite.hitBox.yOffset;
                let isColliding1 = this.isCollidingWithObstacleAt(xPos, yPos);
                
                xPos = sprite.xPos + sprite.hitBox.xOffset;
                yPos = sprite.yPos + sprite.hitBox.yOffset;
                let isColliding2 = this.isCollidingWithObstacleAt(xPos, yPos);
                
                if (isColliding1 || isColliding2) {
                    let minOverlapY = Infinity;
                    
                    if (isColliding1) {
                        xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize - 1;
                        yPos = sprite.yPos + sprite.hitBox.yOffset;
                        let overlapY = brickSize - Math.floor(yPos) % brickSize;
                        minOverlapY = Math.min(minOverlapY, overlapY);
                    }
                    if (isColliding2) {
                        xPos = sprite.xPos + sprite.hitBox.xOffset;
                        yPos = sprite.yPos + sprite.hitBox.yOffset;
                        let overlapY = brickSize - Math.floor(yPos) % brickSize;
                        minOverlapY = Math.min(minOverlapY, overlapY);
                    }
                    
                    sprite.yPos += minOverlapY;
                    sprite.physics.vy = 0;
                }
            }
        }
    }
    
    static detectCollisions() {
        const player = globals.player;
        if (!player) return;
        
        this.resolveMapCollision(player);
        
        const playerHitBox = {
            x: player.xPos + player.hitBox.xOffset,
            y: player.yPos + player.hitBox.yOffset,
            w: player.hitBox.xSize,
            h: player.hitBox.ySize
        };
        
        for (let i = 0; i < globals.enemies.length; i++) {
            const enemy = globals.enemies[i];
            if (!enemy.isAlive) continue;
            
            const enemyHitBox = {
                x: enemy.xPos + enemy.hitBox.xOffset,
                y: enemy.yPos + enemy.hitBox.yOffset,
                w: enemy.hitBox.xSize,
                h: enemy.hitBox.ySize
            };
            
            if (this.rectIntersect(playerHitBox, enemyHitBox)) {
                if (!enemy.isCollidingWithPlayer) {
                    enemy.isCollidingWithPlayer = true;
                    this.onCollisionWithEnemy(enemy);
                }
            } else {
                enemy.isCollidingWithPlayer = false;
            }
        }

        if (globals.object) {
            const potionHitBox = {
                x: globals.object.xPos + globals.object.hitBox.xOffset,
                y: globals.object.yPos + globals.object.hitBox.yOffset,
                w: globals.object.hitBox.xSize,
                h: globals.object.hitBox.ySize
            };
        
            if (this.rectIntersect(playerHitBox, potionHitBox)) {
                this.onCollisionWithPotion();
            }
        }
    }
    
    static rectIntersect(rect1, rect2) {
        return !(rect2.x >= rect1.x + rect1.w ||
                 rect2.x + rect2.w <= rect1.x ||
                 rect2.y >= rect1.y + rect1.h ||
                 rect2.y + rect2.h <= rect1.y);
    }
    
    static onCollisionWithEnemy(enemy) {
        console.log("Collision with enemy:", enemy.id);
        
        globals.currentEnemy = enemy;
        globals.gameState = GameState.COMBAT;

        if (globals.gameInstance) {
            globals.gameInstance.gameState = GameState.COMBAT;
            globals.gameInstance.combatTurn = new CombatTurn(globals.player, enemy, globals.gameInstance.inputManager);
        }
    }

    static onCollisionWithPotion() {
        console.log("Collision with potion");
        if (globals.inventory) {
            globals.inventory.addPotion();
        }
        globals.object = null;
    }
}