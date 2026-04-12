// CollisionManager.js
import globals from './globals.js';
import { GameState, SpriteID } from './constants.js';

export default class CollisionManager {
    
    // Lista de IDs de tiles que son obstáculos (sólidos)
    static getSolidTileIds() {
        return [
            
        ];
    }
    
    // Obtener el ID del tile en una posición específica
    static getTileIdAt(x, y) {
        const map = globals.map;
        if (!map || !map.data) return 0;
        
        const brickSize = map.imageSet.gridSize;
        const col = Math.floor(x / brickSize);
        const row = Math.floor(y / brickSize);
        
        // Verificar límites
        if (row < 0 || row >= map.data.length || col < 0 || col >= map.data[0].length) {
            return 0;
        }
        
        return map.data[row][col];
    }
    
    // Verificar si una posición colisiona con un obstáculo
    static isCollidingWithObstacleAt(x, y) {
        const tileId = this.getTileIdAt(x, y);
        const solidTiles = this.getSolidTileIds();
        return solidTiles.includes(tileId);
    }
    
    // Detectar colisiones entre un sprite y los obstáculos del mapa
    static detectCollisionWithMap(sprite) {
        if (!sprite || !sprite.hitBox) return;
        
        const brickSize = globals.map.imageSet.gridSize;
        
        // Obtener los 4 puntos de la hitbox del sprite
        const left = sprite.xPos + sprite.hitBox.xOffset;
        const right = left + sprite.hitBox.xSize;
        const top = sprite.yPos + sprite.hitBox.yOffset;
        const bottom = top + sprite.hitBox.ySize;
        
        // Puntos de colisión (esquinas)
        const points = [
            { x: left, y: top },      // Esquina superior izquierda
            { x: right, y: top },     // Esquina superior derecha
            { x: left, y: bottom },   // Esquina inferior izquierda
            { x: right, y: bottom },  // Esquina inferior derecha
            { x: left + sprite.hitBox.xSize / 2, y: top },     // Centro superior
            { x: left + sprite.hitBox.xSize / 2, y: bottom },  // Centro inferior
            { x: left, y: top + sprite.hitBox.ySize / 2 },     // Centro izquierdo
            { x: right, y: top + sprite.hitBox.ySize / 2 }     // Centro derecho
        ];
        
        let hasCollision = false;
        
        // Verificar cada punto
        for (let point of points) {
            if (this.isCollidingWithObstacleAt(point.x, point.y)) {
                hasCollision = true;
                break;
            }
        }
        
        return hasCollision;
    }
    
    // Resolver colisión con el mapa (reposicionar al sprite)
    static resolveMapCollision(sprite) {
        if (!sprite || !sprite.hitBox) return;
        
        const brickSize = globals.map.imageSet.gridSize;
        let resolved = false;
        
        // Guardar posición original
        const originalX = sprite.xPos;
        const originalY = sprite.yPos;
        
        // --- RESOLVER COLISIÓN EN X ---
        // Mover gradualmente hacia atrás en X
        let step = Math.abs(sprite.physics.vx * globals.deltaTime);
        if (step < 1) step = 2;
        
        for (let i = 0; i < step && !resolved; i++) {
            if (sprite.physics.vx > 0) {
                // Movimiento hacia la derecha
                const checkX = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize;
                const checkY = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize / 2;
                if (this.isCollidingWithObstacleAt(checkX, checkY)) {
                    // Encontrar el borde del tile
                    const tileCol = Math.floor(checkX / brickSize);
                    const tileX = tileCol * brickSize;
                    sprite.xPos = tileX - sprite.hitBox.xOffset - sprite.hitBox.xSize;
                    sprite.physics.vx = 0;
                    resolved = true;
                }
            } 
            else if (sprite.physics.vx < 0) {
                // Movimiento hacia la izquierda
                const checkX = sprite.xPos + sprite.hitBox.xOffset;
                const checkY = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize / 2;
                if (this.isCollidingWithObstacleAt(checkX, checkY)) {
                    // Encontrar el borde del tile
                    const tileCol = Math.floor(checkX / brickSize);
                    const tileX = (tileCol + 1) * brickSize;
                    sprite.xPos = tileX - sprite.hitBox.xOffset;
                    sprite.physics.vx = 0;
                    resolved = true;
                }
            }
            
            if (!resolved) {
                sprite.xPos += (sprite.physics.vx > 0 ? -1 : (sprite.physics.vx < 0 ? 1 : 0));
            }
        }
        
        // --- RESOLVER COLISIÓN EN Y ---
        resolved = false;
        
        for (let i = 0; i < step && !resolved; i++) {
            if (sprite.physics.vy > 0) {
                // Movimiento hacia abajo
                const checkX = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize / 2;
                const checkY = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize;
                if (this.isCollidingWithObstacleAt(checkX, checkY)) {
                    // Encontrar el borde del tile
                    const tileRow = Math.floor(checkY / brickSize);
                    const tileY = tileRow * brickSize;
                    sprite.yPos = tileY - sprite.hitBox.yOffset - sprite.hitBox.ySize;
                    sprite.physics.vy = 0;
                    resolved = true;
                }
            }
            else if (sprite.physics.vy < 0) {
                // Movimiento hacia arriba
                const checkX = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize / 2;
                const checkY = sprite.yPos + sprite.hitBox.yOffset;
                if (this.isCollidingWithObstacleAt(checkX, checkY)) {
                    // Encontrar el borde del tile
                    const tileRow = Math.floor(checkY / brickSize);
                    const tileY = (tileRow + 1) * brickSize;
                    sprite.yPos = tileY - sprite.hitBox.yOffset;
                    sprite.physics.vy = 0;
                    resolved = true;
                }
            }
            
            if (!resolved) {
                sprite.yPos += (sprite.physics.vy > 0 ? -1 : (sprite.physics.vy < 0 ? 1 : 0));
            }
        }
        
        // Si no se resolvió completamente, restaurar posición original
        if (this.detectCollisionWithMap(sprite)) {
            sprite.xPos = originalX;
            sprite.yPos = originalY;
            sprite.physics.vx = 0;
            sprite.physics.vy = 0;
        }
    }
    
    // Método principal de detección de colisiones
    static detectCollisions() {
        const player = globals.player;
        if (!player) return;
        
        // 1. Detectar colisiones del jugador con el mapa
        if (this.detectCollisionWithMap(player)) {
            this.resolveMapCollision(player);
        }
        
        // 2. Calcular hitbox del jugador para colisiones con enemigos
        const playerHitBox = {
            x: player.xPos + player.hitBox.xOffset,
            y: player.yPos + player.hitBox.yOffset,
            w: player.hitBox.xSize,
            h: player.hitBox.ySize
        };
        
        // 3. Verificar colisión con cada enemigo
        for (let i = 0; i < globals.enemies.length; i++) {
            const enemy = globals.enemies[i];
            if (!enemy.isAlive) continue;
            
            // Calcular hitbox del enemigo
            const enemyHitBox = {
                x: enemy.xPos + enemy.hitBox.xOffset,
                y: enemy.yPos + enemy.hitBox.yOffset,
                w: enemy.hitBox.xSize,
                h: enemy.hitBox.ySize
            };
            
            // Detectar colisión entre jugador y enemigo
            if (this.rectIntersect(playerHitBox, enemyHitBox)) {
                if (!enemy.isCollidingWithPlayer) {
                    enemy.isCollidingWithPlayer = true;
                    this.onCollisionWithEnemy(enemy);
                }
            } else {
                enemy.isCollidingWithPlayer = false;
            }
        }
    }
    
    // Detectar colisión entre dos rectángulos
    static rectIntersect(rect1, rect2) {
        return !(rect2.x > rect1.x + rect1.w ||
                 rect2.x + rect2.w < rect1.x ||
                 rect2.y > rect1.y + rect1.h ||
                 rect2.y + rect2.h < rect1.y);
    }
    
    // Manejar colisión con enemigo
    static onCollisionWithEnemy(enemy) {
        console.log("Collision with enemy:", enemy.id);
        
        // Guardar el enemigo con el que se está combatiendo
        globals.currentEnemy = enemy;
        
        // Cambiar al estado de combate
        globals.gameState = GameState.COMBAT;
        if (globals.gameInstance) {
            globals.gameInstance.gameState = GameState.COMBAT;
        }
    }
}