import globals from './globals.js';
import { GameState } from './constants.js';
import playerView from './PlayerView.js';
import MapView from './MapView.js';

export class View {

    constructor(ctx) {
        this.ctx = ctx;
        this.playerView = new playerView(ctx);
        this.mapView = new MapView(ctx);
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
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LOADING...', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderIntro() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 60);
        this.ctx.fillText('OF THE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 40);
        this.ctx.fillText('ANCIENT WARRIORS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 20);
        
        this.ctx.font = '12px monospace';
        this.ctx.fillText('Press ENTER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 80);
    }

    renderMenu() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px monospace';
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
            this.ctx.font = isSelected ? 'bold 16px monospace' : '14px monospace';
            this.ctx.fillText(isSelected ? '> ' + text + ' <' : text, this.ctx.canvas.width / 2, y);
        }
    }
    
    renderPlaying() {
        if (globals.map && this.mapView) {
            this.mapView.render();
        }

        if (globals.player) {
            this.playerView.render(); 
        }
    }

    renderGameOver() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'red';
        this.ctx.font = '30px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText('Press ENTER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);
    }

    renderPause() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderVictory() {
        this.ctx.fillStyle = '#1a3a1a';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '30px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }
    
    renderCombat() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('COMBAT MODE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderSettings() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CONTROLS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 80);
        
        this.ctx.font = '12px monospace';
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
        this.ctx.font = '20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE ANCIENT LORE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 100);
        
        this.ctx.font = '12px monospace';
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
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 140);
    }

    renderHighScore() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HIGH SCORES', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 80);
        
        this.ctx.font = '12px monospace';
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
        
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(10, 10, 200, 60);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(15, 20, 190, 15);
        this.ctx.fillStyle = '#00ff00';
        var hpPercent = (globals.player.hp / 120);
        this.ctx.fillRect(15, 20, 190 * hpPercent, 15);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px monospace';
        this.ctx.fillText("HP: " + Math.floor(globals.player.hp) + "/" + globals.player.hp, 45, 18);
        
        if (globals.gameInstance) {
            var timer = Math.max(0, Math.floor(globals.gameInstance.timer));
            this.ctx.fillStyle = 'white';
            this.ctx.fillText("Time: " + timer, 40, 50);
        }
    }
}