import globals from './globals.js';
import { GameState, SpriteID } from './constants.js';
import playerView from './PlayerView.js';
import MapView from './MapView.js';
import ObjectView from './ObjectView.js';

import CombatView from './CombatView.js';

export class View {

    constructor(ctx,game) {
        this.ctx = ctx;
        this.playerView = new playerView(ctx);
        this.mapView = new MapView(ctx);
        this.objectView = new ObjectView(ctx);
        this.combatView = new CombatView(ctx);
        this.game = game;

        this.introBackgroundImg = new Image();
        this.introBackgroundImg.src = './images/IntroBackground.png'
        this.mainBackgroundImg = new Image();
        this.mainBackgroundImg.src = './images/MainBackground.png'
        this.battlegroundImg = new Image();
        this.battlegroundImg.src = './images/Battleground.png';
        this.storyBackgroundImg = new Image();
        this.storyBackgroundImg.src = './images/StoryBackground.png'
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
        this.ctx.font = '16px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('LOADING...', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderIntro() {
        
        this.ctx.drawImage(this.introBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '4vw alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM', this.ctx.canvas.width / 2,  80);
        this.ctx.fillText('OF THE', this.ctx.canvas.width / 2, 140);
        this.ctx.fillText('ANCIENT WARRIORS', this.ctx.canvas.width / 2, 200);
        
        this.ctx.font = '40px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press SPACE to start', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 300);
    }

    renderMenu() {
        
        this.ctx.drawImage(this.mainBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '5vw alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE STORM OF ', this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.1);
        this.ctx.fillText('THE ANCIENT WARRIORS',this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.2 );
        
        const menuItems = ['Play', 'Story', 'Controls', 'High Score'];
        const startY = 550;
        const itemHeight = 50;
        const selectedIndex = (globals.menuIndex !== undefined) ? globals.menuIndex : 0;

        for (let index = 0; index < menuItems.length; index++) {
            const text = menuItems[index];
            const y = startY + (index * itemHeight);
            const isSelected = (index === selectedIndex);

            this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            this.ctx.font = isSelected ? 'bold 52px alkhemikal' : '36px alkhemikal';
            this.ctx.fillText(isSelected ? '> ' + text + ' <' : text, this.ctx.canvas.width / 2, y);
        }
    }
    
    renderPlaying() {
        if (globals.map && this.mapView) {
            this.mapView.render();
        }
        
        if (globals.enemies) {
            for (let i = 0; i < globals.enemies.length; i++) {
                const enemy = globals.enemies[i];
                if (enemy.isAlive && enemy.draw) {
                    enemy.draw(this.ctx);
                    //enemy.drawHitBox(this.ctx);
                }
            }
        }
   
        if (globals.ParticleSystem) {
            globals.ParticleSystem.update();
            globals.ParticleSystem.draw(this.ctx);
        }
        
        if (globals.player) {
            //this.playerView.drawHitBox();
            this.playerView.render();
        }

        if (globals.object) {
            //this.objectView.drawHitBox();
            this.objectView.render();
        }
    }
    
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
        this.ctx.drawImage(this.mainBackgroundImg,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        this.ctx.fillStyle = 'rgb(179, 0, 0)';
        this.ctx.font = '48px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.ctx.canvas.width / 2,80);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px alkhemikal';
        this.ctx.fillText('Press SPACE to go back to main menu',this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
    }

    renderPause() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSE', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    renderVictory() {
        
        this.ctx.drawImage(this.mainBackgroundImg,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        this.ctx.fillStyle = '#e9b200';
        this.ctx.font = '48px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.ctx.canvas.width / 2,80);


        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px alkhemikal';
        this.ctx.fillText('Your score: ' + this.game.score,this.ctx.canvas.width/2, 200)
        this.ctx.fillText('Press SPACE to go back to main menu',this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
        
    }
    
    renderCombat() {
    
        this.ctx.drawImage(this.battlegroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (globals.ParticleSystem) {
            globals.ParticleSystem.update();
            globals.ParticleSystem.draw(this.ctx);
        }

        this.combatView.render();


        if (globals.player) {
            const scale = 3;
            this.ctx.save();
            this.ctx.translate(100 + 48 * scale, 30);
            this.ctx.scale(-scale, scale);

                       

            this.ctx.drawImage(
                globals.tileSets[0],
                56, 2817, 48, 81,
                0, 230 / scale, 48, 101
            );
            this.ctx.restore();
        }
        
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = '48px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('COMBAT', 120, 50);
        
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
            
            this.ctx.fillStyle = enemyColor;
            this.ctx.font = '48px alkhemikal';
            this.ctx.fillText(enemyName, 800, 50);
            
            const barWidth = 200;
            const barHeight = 20;
            const barX = 670;
            const barY = 600;
            
            this.ctx.fillStyle = '#330000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            //Enemy HP bar
            const hpPercent = globals.currentEnemy.hp / globals.currentEnemy.maxHp;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '32px alkhemikal';
            this.ctx.fillText(`HP: ${Math.floor(globals.currentEnemy.hp)}/${globals.currentEnemy.maxHp}`, 760, barY + 45);
            
            if (globals.player) {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.font = '32px alkhemikal';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(`Your HP: ${Math.floor(globals.player.hp)}/${globals.player.maxHp}`, 20,610);
            }
            if(globals.player) {
                this.ctx.fillStyle='#41ddf8';
                this.ctx.font = '32px alkhemikal';
                this.ctx.fillText(`Your mana: ${Math.floor(globals.player.mana)}/${globals.player.maxMana}`, 20,640);
            }
        }

    }

    renderCombatMenu(){

        if(!this.game.combatTurn) return;

        //Combat options box
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(3, 655, 354, 110);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(3, 655, 354, 110);

        const phaseIndex = this.game.combatTurn.phaseIndex;        
        const options = ["ATTACK", "ABILITY", "ITEM", "FLEE"];

        const positions = [
            {x: 15, y: 665 },
            {x: 185, y: 665},
            {x: 15, y: 715},
            {x: 185, y: 715},
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
            this.ctx.font = "32px alkhemikal";
            this.ctx.textAlign = "center";
            this.ctx.fillText(options[i], x +70, y + 30);

            //Combat log box
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(360, 655, 661, 110);
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(360, 655, 661, 110);

            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "left";
            this.ctx.font = "2opx alkhemikal";
            this.ctx.fillText("Combat log coming soon...",370,680);
        }
    }

    renderSettings() {
        
        this.ctx.drawImage(this.storyBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = '#e9b200';
        this.ctx.font = '48px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CONTROLS', this.ctx.canvas.width / 2,80);
        
        this.ctx.font = '32px alkhemikal';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('W - Move Up', this.ctx.canvas.width / 2, 220);
        this.ctx.fillText('S - Move Down', this.ctx.canvas.width / 2, 270);
        this.ctx.fillText('A - Move Left', this.ctx.canvas.width / 2, 320);
        this.ctx.fillText('D - Move Right', this.ctx.canvas.width / 2, 370);
        this.ctx.fillText('E - Inventory', this.ctx.canvas.width/ 2 , 420);
        this.ctx.fillText('SPACE - Confirm/Action', this.ctx.canvas.width / 2, 470);
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press SPACE to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
    }

    renderHistory() {
        
        this.ctx.drawImage(this.storyBackgroundImg,0,0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.fillStyle = '#e9b200';
        this.ctx.font = '48px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE ANCIENT LORE', this.ctx.canvas.width / 2, 80);
        
        this.ctx.font = '32px alkhemikal';
        this.ctx.fillStyle = '#ffffff';
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
            this.ctx.fillText(story[i], this.ctx.canvas.width / 2, 230 + (i * 35));
        }
        
        this.ctx.font= '32px alkhemikal'
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press SPACE to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
    }

    renderHighScore() {
        
        this.ctx.drawImage(this.storyBackgroundImg,0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        
        this.ctx.fillStyle = '##e9b200';
        this.ctx.font = '48px alkhemikal';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HIGH SCORES', this.ctx.canvas.width / 2, 80);
        
        this.ctx.font = '32px alkhemikal';
        this.ctx.fillStyle = '#e7e7e7';
        var scores = [
            "1. WARRIOR - 9999",
            "2. KNIGHT - 8500",
            "3. MAGE - 7200",
            "4. ROGUE - 6800",
            "5. CLERIC - 5500"
        ];
        
        for (var i = 0; i < scores.length; i++) {
            this.ctx.fillText(scores[i], this.ctx.canvas.width / 2, 230 + (i * 50));
        }
        
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('Press SPACE to go back', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 340);
    }
    
    renderHUD() {
        if (!globals.player) return;
        
        //Player HP box
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(2, 3, 200, 70);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(2,3,200,70);
        
        //Enemy and time box
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(2, 78, 200, 60);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(2,78,200,60);

        //Score and highscore box
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(800, 3, 222, 70);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(800,3,222,70);

        //Player HP bar
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(7, 40, 190, 20);
        
        this.ctx.fillStyle = '#00ff00';
        var hpPercent = (globals.player.hp / 120);
        this.ctx.fillRect(7, 40, 190 * hpPercent, 20);
        this.ctx.strokeStyle = "grey";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(7,40,190,20);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px alkhemikal';
        this.ctx.textAlign = 'left';
        this.ctx.fillText("HP: " + Math.floor(globals.player.hp) + "/120", 7, 30);
        
        if (globals.gameInstance) {
            var timer = Math.max(0, Math.floor(globals.gameInstance.timer));
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'left';
            this.ctx.fillText("Time: " + timer, 7, 105);
        }
        
        if (globals.enemies) {
            let aliveCount = 0;
            for (let i = 0; i < globals.enemies.length; i++) {
                if (globals.enemies[i].isAlive) aliveCount++;
            }
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText("Enemies: " + aliveCount, 7, 130);
        }

        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'left';
        this.ctx.fillText("Score: " + this.game.score, 805, 30);
        this.ctx.fillText("HighScore: " + this.game.highScore,805,60);
    }
}