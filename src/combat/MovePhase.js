import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";
import Message from "./Message.js";

export default class MovePhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn, messageQueue) {
    super(player, enemies, dice, combatTurn, messageQueue);
    
    this.movePositions = [100, 250, 400]; 
    this.selectedIndex = 1; 
    this.targetX = null;
    this.errorMessage = "";
    this.errorTimer = 0;
  }

  init() {
    this.state = "waiting";
    
    if (this.player.xPos === this.movePositions[0]) this.selectedIndex = 0;
    else if (this.player.xPos === this.movePositions[2]) this.selectedIndex = 2;
    else this.selectedIndex = 1;
  }

  handleInput() {
    if (this.errorTimer > 0) this.errorTimer--;

    let currentIndex = 1;
    if (this.player.xPos === this.movePositions[0]) currentIndex = 0;
    if (this.player.xPos === this.movePositions[2]) currentIndex = 2;

    if (globals.action.moveLeft) {
      globals.action.moveLeft = false;
      if (this.selectedIndex > 0) {
      
        if (Math.abs((this.selectedIndex - 1) - currentIndex) <= 1) {
          this.selectedIndex--;
        } else {
          this.errorMessage = "You can't move further back!";
          this.errorTimer = 45;
        }
      }
    }

    if (globals.action.moveRight) {
      globals.action.moveRight = false;
      if (this.selectedIndex < this.movePositions.length - 1) {
      
        if (Math.abs((this.selectedIndex + 1) - currentIndex) <= 1) {
          this.selectedIndex++;
        } else {
          this.errorMessage = "You can't move further forward!";
          this.errorTimer = 45;
        }
      }
    }
    if (globals.action.confirm) {
      globals.action.confirm = false;

      if (this.selectedIndex === currentIndex) {
        this.errorMessage = "You are already in this position";
        this.errorTimer = 45;
      } else if (Math.abs(this.selectedIndex - currentIndex) === 1) {
        this.state = "executing";
      } else {
        this.errorMessage = "Invalid move!";
        this.errorTimer = 45;
      }
    }
  }

  execute() {
    this.targetX = this.movePositions[this.selectedIndex];
    this.player.xPos = this.targetX;
    
    this.messageQueue.push(new Message(`${this.player.name || "Player"} moved to the ${this.getPositionName()}!`, 'move'));
    
    if (this.player.state !== undefined) {
      this.player.state = -1; 
      this.player.animationTimer = 20;
      this.player.frames.frameCounter = 0;
    }

    if (globals.ParticleSystem) {
      globals.ParticleSystem.createExplosion(this.targetX + 60, 380, 0.4);
    }

    this.state = "completed";
  }

  getPositionName() {
    const names = ["back", "middle", "front"];
    return names[this.selectedIndex];
  }
  
  getMovePositions() {
    return this.movePositions;
  }

  getMoveIndex() {
    return this.selectedIndex;
  }

  renderUI(ctx) {
    
    const groundY = 320;      
    const boxWidth = 140;     
    const boxHeight = 300;     

    let currentIndex = 1;
    if (this.player.xPos === this.movePositions[0]) currentIndex = 0;
    if (this.player.xPos === this.movePositions[2]) currentIndex = 2;

    for (let i = 0; i < 3; i++) {
    
      const cellX = this.movePositions[i] + 50 - (boxWidth / 2); 
      
      const isSelected = (i === this.selectedIndex);
      const isCurrent = (i === currentIndex);

      if (isSelected) {
        ctx.fillStyle = "rgba(255, 204, 102, 0.25)";
        ctx.strokeStyle = "#ffcc66";
        ctx.lineWidth = 3;
      } else if (isCurrent) {
        ctx.fillStyle = "rgba(100, 255, 100, 0.1)";
        ctx.strokeStyle = "rgba(100, 255, 100, 0.5)";
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
      }

      ctx.fillRect(cellX, groundY, boxWidth, boxHeight);
      ctx.strokeRect(cellX, groundY, boxWidth, boxHeight);

      if (isSelected) {
        const arrowX = cellX + (boxWidth / 2);
        const arrowY = 300 + 30; 

        ctx.save();
        ctx.fillStyle = "#ffcc66";
        ctx.font = "bold 48px Arial"; 
        ctx.textAlign = "center";
        
        ctx.shadowColor = "#ffcc66";
        ctx.shadowBlur = 6;

        ctx.fillText("🡇", arrowX, arrowY); 
        ctx.restore();
      }
    }

    if (this.errorMessage !== "" && this.errorTimer > 0) {
      ctx.save();
      ctx.fillStyle = "#ff5555";
      ctx.font = "bold 20px alkhemikal";
      ctx.textAlign = "center";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.fillText(this.errorMessage, ctx.canvas.width / 2, groundY - 120);
      ctx.restore();
    }
  }
}