import globals from './globals.js';
import { GameState, SpriteID } from './constants.js';
import playerView from './PlayerView.js';
import MapView from './MapView.js';
import CombatTurn from './CombatTurn.js';

export class View {

    constructor(ctx,game) {
        this.ctx = ctx;
        this.playerView = new playerView(ctx);
        this.mapView = new MapView(ctx);
        this.game = game;

        //Combat background
        this.battlegroundImg = new Image();
        this.battlegroundImg.src = './images/Battleground.png';
    }

    render() {
        
        switch (globals.gameState) {

            case GameState.LOADING:
                this.renderLoading();
                break;

            case GameState.INTRO:
                this.renderIntro();
                break;

            case GameState.MENU:
                this.renderMenu();
                break;
            
            case GameState.PLAYING: 
                this.renderPlaying();
                this.renderHUD();
                break;

            case GameState.COMBAT:
                this.renderCombat();
                this.renderCombatMenu();
                break;

            case GameState.GAME_OVER:
                this.renderGameOver();
                break;

            case GameState.VICTORY:
                this.renderVictory();
                break;

            case GameState.SETTINGS:
                this.renderSettings();
                break;

            case GameState.HISTORY:
                this.renderHistory();
                break;

            case GameState.HIGHSCORE:
                this.renderHighScore();
                break;

            case GameState.PAUSE:
                this.renderPause();
                break;
        }
        
    }

    renderLoading() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LOADING...', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderIntro() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 60);
        this.ctx.fillText('OF THE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 40);
        this.ctx.fillText('ANCIENT WARRIORS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 20);
        
        this.ctx.font = '12px emulogic';
        this.ctx.fillText('Press ENTER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 80);
    }

    renderMenu() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM OF THE ANCIENT WARRIORS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 60);
        
        const menuItems = ['Play', 'Story', 'Controls', 'High Score'];
        const startY = this.ctx.canvas.height / 2;
        const itemHeight = 30;
        const selectedIndex = (globals.menuIndex !== undefined) ? globals.menuIndex : 0;

        for (let index = 0; index < menuItems.length; index++) {
            const text = menuItems[index];
            const y = startY + (index * itemHeight);
            const isSelected = (index === selectedIndex);

            this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            this.ctx.font = isSelected ? 'bold 16px emulogic' : '14px emulogic';
            this.ctx.fillText(isSelected ? '> ' + text + ' <' : text, this.ctx.canvas.width / 2, y);
        }
    }
    
    renderPlaying() {
        // Renderizar el mapa
        if (globals.map && this.mapView) {
            this.mapView.render();
        }
        
        // ========== RENDERIZAR ENEMIGOS ==========
        if (globals.enemies) {
            for (let i = 0; i < globals.enemies.length; i++) {
                const enemy = globals.enemies[i];
                if (enemy.isAlive && enemy.draw) {
                    enemy.draw(this.ctx);
                }
            }
        }
        // ========================================
        
        // Renderizar al jugador (encima de los enemigos)
        if (globals.player) {
            this.playerView.render(); 
        }
        
    }
    
    // Método opcional para debugging de colisiones
    drawAllHitBoxes() {
        if (globals.player) {
            this.playerView.drawHitBox(globals.player);
        }
        
        if (globals.enemies) {
            for (let i = 0; i < globals.enemies.length; i++) {
                const enemy = globals.enemies[i];
                if (enemy.isAlive && enemy.hitBox) {
                    const x = Math.floor(enemy.xPos) + enemy.hitBox.xOffset;
                    const y = Math.floor(enemy.yPos) + enemy.hitBox.yOffset;
                    this.ctx.strokeStyle = "red";
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x, y, enemy.hitBox.xSize, enemy.hitBox.ySize);
                }
            }
        }
    }

    renderGameOver() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'red';
        this.ctx.font = '30px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px emulogic';
        this.ctx.fillText('Press ENTER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);
    }

    renderPause() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderVictory() {
        this.ctx.fillStyle = '#1a3a1a';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '30px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }
    
    renderCombat() {
    
        this.ctx.drawImage(this.battlegroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Título
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('COMBAT', 120, 50);
        
        // Mostrar información del enemigo
        if (globals.currentEnemy) {
            let enemyName = "";
            let enemyColor = "";
            switch(globals.currentEnemy.id) {
                case SpriteID.SLIME:
                    enemyName = "SLIME";
                    enemyColor = "#88ff88";
                    break;
                case SpriteID.SKELETON:
                    enemyName = "SKELETON";
                    enemyColor = "#cccccc";
                    break;
                case SpriteID.MAGE:
                    enemyName = "MAGE";
                    enemyColor = "#cc88ff";
                    break;
                default:
                    enemyName = "ENEMY";
                    enemyColor = "#ffffff";
            }
            
            // Nombre del enemigo
            this.ctx.fillStyle = enemyColor;
            this.ctx.font = '32px emulogic';
            this.ctx.fillText(enemyName, 700, 50);
            
            // Barra de HP del enemigo
            const barWidth = 200;
            const barHeight = 20;
            const barX = 570;
            const barY = 80;
            
            // Fondo de la barra (rojo)
            this.ctx.fillStyle = '#330000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // HP actual (verde)
            const hpPercent = globals.currentEnemy.hp / globals.currentEnemy.maxHp;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            
            // Borde de la barra
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
            
            // Texto de HP
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px emulogic';
            this.ctx.fillText(`HP: ${Math.floor(globals.currentEnemy.hp)}/${globals.currentEnemy.maxHp}`, 
                             660, barY + 45);
            
            // Mostrar HP del jugador
            if (globals.player) {
                this.ctx.fillStyle = '#ff8888';
                this.ctx.font = '14px emulogic';
                this.ctx.fillText(`Your HP: ${Math.floor(globals.player.hp)}/${globals.player.maxHp}`, 
                                 150,430);
            }
        }

    }


    renderCombatMenu(){

        if(!this.game.combatTurn) return;
        const phaseIndex = this.game.combatTurn.phaseIndex;        
        const options = ["Attack", "Ability", "Item", "Flee"];

        const positions = [
            {x: 20, y: 450 },
            {x: 190, y: 450},
            {x: 20, y: 500},
            {x: 190, y: 500},
        ];

        const optWidth = 160;
        const optHeight = 40;

        for(let i = 0; i < options.length; i++){
            const {x, y} = positions[i];

            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(x,y,optWidth,optHeight);

            if(i === phaseIndex){
                this.ctx.strokeStyle = "red";
                this.ctx.lineWidth = 4;

            } else {
                this.ctx.strokeStyle = "#555";
                this.ctx.lineWidth = 1;
            }
            this.ctx.strokeRect (x,y,optWidth,optHeight);

            this.ctx.fillStyle = "black";
            this.ctx.font = "20px emulogic";
            this.ctx.textAlign = "center";
            this.ctx.fillText(options[i], x +70, y + 30);
        }
    }

    renderSettings() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CONTROLS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 80);
        
        this.ctx.font = '12px emulogic';
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillText('W / UP ARROW - Move Up', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 30);
        this.ctx.fillText('S / DOWN ARROW - Move Down', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        this.ctx.fillText('A / LEFT ARROW - Move Left', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 30);
        this.ctx.fillText('D / RIGHT ARROW - Move Right', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 60);
        this.ctx.fillText('ENTER - Confirm/Action', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 90);
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 140);
    }

    renderHistory() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = '#d4af37';
        this.ctx.font = '20px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE ANCIENT LORE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 100);
        
        this.ctx.font = '12px emulogic';
        this.ctx.fillStyle = '#ccc';
        var story = [
            "In a time of chaos, ancient warriors",
            "rise again to face the darkness...",
            "",
            "You are the chosen hero destined",
            "to restore peace to the kingdom.",
            "",
            "Find the ancient artifacts and",
            "defeat the evil that threatens the land."
        ];
        
        for (var i = 0; i < story.length; i++) {
            this.ctx.fillText(story[i], this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 40 + (i * 25));
        }
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 180);
    }

    renderHighScore() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HIGH SCORES', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 80);
        
        this.ctx.font = '12px emulogic';
        this.ctx.fillStyle = '#aaa';
        var scores = [
            "1. WARRIOR - 9999",
            "2. KNIGHT - 8500",
            "3. MAGE - 7200",
            "4. ROGUE - 6800",
            "5. CLERIC - 5500"
        ];
        
        for (var i = 0; i < scores.length; i++) {
            this.ctx.fillText(scores[i], this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 30 + (i * 25));
        }
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 100);
    }
    
    renderHUD() {
        if (!globals.player) return;
        
        // Fondo del HUD
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(10, 5, 200, 70);
        
        // Barra de HP (fondo rojo)
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(15, 20, 190, 15);
        
        // Barra de HP (relleno verde según HP actual)
        this.ctx.fillStyle = '#00ff00';
        var hpPercent = (globals.player.hp / 120);
        this.ctx.fillRect(15, 20, 190 * hpPercent, 15);
        
        // Texto de HP
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px emulogic';
        this.ctx.fillText("HP: " + Math.floor(globals.player.hp) + "/120", 70, 18);
        
        // Temporizador
        if (globals.gameInstance) {
            var timer = Math.max(0, Math.floor(globals.gameInstance.timer));
            this.ctx.fillStyle = 'white';
            this.ctx.fillText("Time: " + timer, 60, 50);
        }
        
        // Contador de enemigos vivos (opcional)
        if (globals.enemies) {
            let aliveCount = 0;
            for (let i = 0; i < globals.enemies.length; i++) {
                if (globals.enemies[i].isAlive) aliveCount++;
            }
            this.ctx.fillStyle = '#aaaaaa';
            this.ctx.fillText("Enemies: " + aliveCount, 68, 65);
        }
    }
}