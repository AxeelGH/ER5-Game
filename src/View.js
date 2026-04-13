import globals from './globals.js';
import { GameState, SpriteID } from './constants.js';
import playerView from './PlayerView.js';
import MapView from './MapView.js';


export class View {

    constructor(ctx,game) {
        this.ctx = ctx;
        this.playerView = new playerView(ctx);
        this.mapView = new MapView(ctx);
        this.game = game;


        //Intro Screen background
        this.introBackgroundImg = new Image();
        this.introBackgroundImg.src = './images/IntroBackground.png'
        //Main Screen background
        this.mainBackgroundImg = new Image();
        this.mainBackgroundImg.src = './images/MainBackground.png'
        //Combat background
        this.battlegroundImg = new Image();
        this.battlegroundImg.src = './images/Battleground.png';
        //Story background
        this.storyBackgroundImg = new Image();
        this.storyBackgroundImg.src = './images/StoryBackground.png'
        //Highscores background
        this.highScoreBackgroundImg = new Image();
        this.highScoreBackgroundImg.src = './images/HighScoreBackground.jpg'
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
        
        this.ctx.drawImage(this.introBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM', this.ctx.canvas.width / 2,  60);
        this.ctx.fillText('OF THE', this.ctx.canvas.width / 2, 100);
        this.ctx.fillText('ANCIENT WARRIORS', this.ctx.canvas.width / 2, 140);
        
        this.ctx.font = '20px emulogic';
        this.ctx.fillText('Press ENTER', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 200);
    }

    renderMenu() {
        
        this.ctx.drawImage(this.mainBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM OF ', this.ctx.canvas.width / 2, 60);
        this.ctx.fillText('THE ANCIENT WARRIORS',this.ctx.canvas.width / 2,  100);
        
        const menuItems = ['Play', 'Story', 'Controls', 'High Score'];
        const startY = 450;
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
        //Render map
        if (globals.map && this.mapView) {
            this.mapView.render();
        }
        
        //Render enemies
        if (globals.enemies) {
            for (let i = 0; i < globals.enemies.length; i++) {
                const enemy = globals.enemies[i];
                if (enemy.isAlive && enemy.draw) {
                    enemy.draw(this.ctx);
                    enemy.drawHitBox(this.ctx); 
                    //enemy.drawSpriteRectangle(this.ctx);
                }
            }
        }
   
        
        //Render player
        if (globals.player) {
            
            //this.playerView.drawSpriteRectangle();
            this.playerView.drawHitBox();
            this.playerView.render(); 
        }
        
    }
    
    //Debugg method
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

if (globals.player) {
    const scale = 3;
    this.ctx.save();
    this.ctx.translate(100 + 48 * scale, 0); 
    this.ctx.scale(-scale, scale);            
    this.ctx.drawImage(
        globals.tileSets[0],
        56, 2817, 48, 81,
        0, 150 / scale, 48, 81
    );
    this.ctx.restore();
        }
        
        //Title
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('COMBAT', 120, 50);
        
        //Enemy Info
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
            
            //Enemy name
            this.ctx.fillStyle = enemyColor;
            this.ctx.font = '32px emulogic';
            this.ctx.fillText(enemyName, 650, 50);
            
            //Enemy Hp bar
            const barWidth = 200;
            const barHeight = 20;
            const barX = 570;
            const barY = 80;
            
            // Fondo de la barra (rojo)
            this.ctx.fillStyle = '#330000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            //Hp
            const hpPercent = globals.currentEnemy.hp / globals.currentEnemy.maxHp;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            
            //Bar stroke
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
            
            //HP text
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px emulogic';
            this.ctx.fillText(`HP: ${Math.floor(globals.currentEnemy.hp)}/${globals.currentEnemy.maxHp}`, 
                             660, barY + 45);
            
            //Player HP
            if (globals.player) {
                this.ctx.fillStyle = '#ff0000';
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
        
        this.ctx.drawImage(this.storyBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CONTROLS', this.ctx.canvas.width / 2,80);
        
        this.ctx.font = '12px emulogic';
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillText('W - Move Up', this.ctx.canvas.width / 2, 170);
        this.ctx.fillText('S - Move Down', this.ctx.canvas.width / 2, 200);
        this.ctx.fillText('A - Move Left', this.ctx.canvas.width / 2, 230);
        this.ctx.fillText('D - Move Right', this.ctx.canvas.width / 2, 260);
        this.ctx.fillText('E - Inventory', this.ctx.canvas.width/ 2 , 290);
        this.ctx.fillText('ENTER - Confirm/Action', this.ctx.canvas.width / 2, 360);
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 270);
    }

    renderHistory() {
        
        this.ctx.drawImage(this.storyBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = '#d4af37';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE ANCIENT LORE', this.ctx.canvas.width / 2, 80);
        
        this.ctx.font = '10px emulogic';
        this.ctx.fillStyle = '#ccc';
        var story = [
            "In a time of chaos, ancient warriors",
            "rise again to face the darkness...",
            "",
            "You are the chosen hero destined",
            "to restore peace to the kingdom.",
            "",
            "Find the legendary sword and",
            "defeat the evil that threatens the land."
        ];
        
        for (var i = 0; i < story.length; i++) {
            this.ctx.fillText(story[i], this.ctx.canvas.width / 2, 170 + (i * 25));
        }
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 270);
    }

    renderHighScore() {
        
        // this.ctx.drawImage(this.highScoreBackgroundImg,this.ctx.canvas.width/2-1600/2,0,1600,this.ctx.canvas.height);
        //this.ctx.drawImage(this.highScoreBackgroundImg,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        this.ctx.drawImage(this.storyBackgroundImg,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        
        this.ctx.fillStyle = '#d4af37';
        this.ctx.font = '32px emulogic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HIGH SCORES', this.ctx.canvas.width / 2, 80);
        
        this.ctx.font = '12px emulogic';
        this.ctx.fillStyle = '#e7e7e7';
        var scores = [
            "1. WARRIOR - 9999",
            "2. KNIGHT - 8500",
            "3. MAGE - 7200",
            "4. ROGUE - 6800",
            "5. CLERIC - 5500"
        ];
        
        for (var i = 0; i < scores.length; i++) {
            this.ctx.fillText(scores[i], this.ctx.canvas.width / 2, 170 + (i * 30));
        }
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press ENTER to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 270);
    }
    
    renderHUD() {
        if (!globals.player) return;
        
        // Background color HP
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(10, 5, 200, 40);
        
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(310, 5, 200, 60);

        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(590, 5, 200, 40);

        // HP Bar
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(15, 20, 190, 15);
        
        // HP Bar
        this.ctx.fillStyle = '#00ff00';
        var hpPercent = (globals.player.hp / 120);
        this.ctx.fillRect(15, 20, 190 * hpPercent, 15);
        
        // HP Text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px emulogic';
        this.ctx.fillText("HP: " + Math.floor(globals.player.hp) + "/120", 70, 18);
        
        // Timer
        if (globals.gameInstance) {
            var timer = Math.max(0, Math.floor(globals.gameInstance.timer));
            this.ctx.fillStyle = 'white';
            this.ctx.fillText("Time: " + timer, 410, 27);
        }
        
        // Enemy counter
        if (globals.enemies) {
            let aliveCount = 0;
            for (let i = 0; i < globals.enemies.length; i++) {
                if (globals.enemies[i].isAlive) aliveCount++;
            }
            this.ctx.fillStyle = '#aaaaaa';
            this.ctx.fillText("Enemies: " + aliveCount, 410, 55);
        }
    }
}