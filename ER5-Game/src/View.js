import globals from './globals.js';
import { GameState } from './constants.js';
import playerView from './PlayerView.js';

export class View {

    constructor(ctx) {

        this.ctx = ctx;
    }

    render() {
        
        switch (globals.gameState) {

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

    renderIntro() {

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 60);
        this.ctx.fillText('OF THE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 40);
        this.ctx.fillText('ANCIENT WARRIORS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 20);
        
        this.ctx.font = '8px emulogic';
        this.ctx.fillText('Press ENTER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 80);
    }

    renderMenu() {
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM OF THE ANCIENT WARRIORS', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - 30);
        
        const menuItems = ['Play', 'Story', 'Controls', 'High Score'];
        const startY = this.ctx.canvas.height / 2 + 20;
        const itemHeight = 25;
        const selectedIndex = (globals.menuIndex !== undefined) ? globals.menuIndex : 0;

        for (let index = 0; index < menuItems.length; index++) {
            const text = menuItems[index];
            const y = startY + (index * itemHeight);
            const isSelected = (index === selectedIndex);

            this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            this.ctx.fillText(text, this.ctx.canvas.width / 2, y);
        }
    }
    

    renderPlaying() {

        if (globals.player) {
            this.playerView.render(); 
        }
        console.log("Rendering");
    }

    renderGameOver() {

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'red';
        this.ctx.font = '40px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderPause() {

        // semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '40px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderVictory() {

        this.ctx.fillStyle = '#1a3a1a';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '40px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }
    
    renderCombat() {

    }

    renderSettings() {

        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'white';
        ctx.font = '16px emulogic';
        ctx.textAlign = 'center';
        ctx.fillText('CONTROLS', w / 2, h / 2 - 100);

        ctx.textAlign = 'center';
        ctx.fillStyle = 'yellow';
        ctx.fillText('Back', w / 2, h / 2 + 120);
    }

    renderHistory() {

        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#d4af37';
        ctx.font = '32px emulogic';
        ctx.textAlign = 'center';
        ctx.fillText('THE ANCIENT LORE', w / 2, h / 2 - 120);

        ctx.font = '16px emulogic';
        ctx.fillStyle = 'yellow';
        ctx.fillText('Back', w / 2, h / 2 + 120);
    }

    renderHighScore() {

        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'white';
        ctx.font = '32px emulogic';
        ctx.textAlign = 'center';
        ctx.fillText('HIGH SCORES', w / 2, h / 2 - 100);

        const isSelected = globals.subMenuIndex === 0;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
        this.ctx.font = '20px emulogic';
        this.ctx.fillText('Back', this.ctx.canvas.width / 2, this.ctx.canvas.height - 60);
    }
    
    renderHUD() {
        
    }

    
}