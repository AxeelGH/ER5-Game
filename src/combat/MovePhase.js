import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";

export default class MovePhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn) {
    super(player, enemies, dice, combatTurn);
    this.movePositions = [100, 250, 450];
    this.selectedIndex = 1;
    this.targetX = null;
    this.errorMessage = "";
    this.errorTimer = 0;
  }

  init() {
    this.state = "waiting";
    if(this.player.xPos === 100)
    {
      this.selectedIndex = 0;
    }
    else if(this.player.xPos === 450)
    {
      this.selectedIndex = 2
    }
    else 
    {
      this.selectedIndex = 1
    }
    console.log("Move phase - select position with LEFT/RIGHT, confirm with SPACE");
  }

  handleInput() {
  let currentIndex = 1;
  if (this.player.xPos === 100) currentIndex = 0;
  if (this.player.xPos === 450) currentIndex = 2;
  
  if (globals.action.moveLeft) {
    globals.action.moveLeft = false;
    
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      console.log("Position: " + this.getPositionName());
    } else {
      this.errorMessage = "¡YOU ONLY CAN MOVE ONE POSITION!";
      this.errorTimer = 60;
      console.log("YOU ONLY CAN MOVE ONE POSITION!");
    }
  }

  if (globals.action.moveRight) {
    globals.action.moveRight = false;
    
    if (this.selectedIndex < this.movePositions.length - 1) {
      this.selectedIndex++;
      console.log("Position: " + this.getPositionName());
    } else {
      this.errorMessage = "¡YOU ONLY CAN MOVE ONE POSITION!";
      this.errorTimer = 60;
      console.log("You only can move one position");
    }
  }

  if (globals.action.confirm) {
    globals.action.confirm = false;
    
    if (this.selectedIndex === currentIndex || 
        this.selectedIndex === currentIndex - 1 || 
        this.selectedIndex === currentIndex + 1) {
      this.state = "executing";
    } else {
      this.errorMessage = "¡YOU ONLY CAN MOVE ONE POSITION!";
      this.errorTimer = 100;
      console.log("YOU ONLY CAN MOVE ONE POSITION!");
      this.selectedIndex = currentIndex;
    }
  }
}

  execute() {
    
     let currentIndex = 1; 
  if (this.player.xPos === 100) currentIndex = 0; 
  if (this.player.xPos === 450) currentIndex = 2; 
  
  if ((this.selectedIndex === 0 && currentIndex === 2) ||
      (this.selectedIndex === 2 && currentIndex === 0)) {
    console.log("YOU ONLY CAN MOVE ONE POSITION!");
    this.cancelled = true;
    this.state = "completed";
    return;
  }
  
  this.targetX = this.movePositions[this.selectedIndex];
  console.log("Moving player from position " + currentIndex + " to " + this.selectedIndex);

  if (this.player) {
    this.player.xPos = this.targetX;
    this.player.state = 2;
    this.player.animationTimer = 20;

    if (globals.ParticleSystem) {
      globals.ParticleSystem.createExplosion(this.targetX, 340, 0.5);
    }
  }

  this.state = "completed";
}

update() {
  if (this.errorTimer > 0) {
    this.errorTimer--;
    if (this.errorTimer <= 0) {
      this.errorMessage = "";
    }
  }
}

  getPositionName() {
    const names = ["LEFT", "CENTER", "RIGHT"];
    return names[this.selectedIndex];
  }

  getMovePositions() {
    return this.movePositions;
  }

  getMoveIndex() {
    return this.selectedIndex;
  }

  renderUI(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(50, 600, 500, 150);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 600, 500, 150);

    ctx.fillStyle = "white";
    ctx.font = "24px alkhemikal";
    ctx.textAlign = "center";
    ctx.fillText("CHOOSE POSITION TO MOVE", 300, 630);

    const positionsText = ["LEFT", "CENTER", "RIGHT"];
    const positionsX = [150, 300, 450];

    for (let i = 0; i < positionsText.length; i++) {
      if (i === this.selectedIndex) {
        ctx.fillStyle = "yellow";
        ctx.font = "bold 20px alkhemikal";
        ctx.fillText("> " + positionsText[i] + " <", positionsX[i], 690);
      } else {
        ctx.fillStyle = "white";
        ctx.font = "20px alkhemikal";
        ctx.fillText(positionsText[i], positionsX[i], 690);
      }
    }

    ctx.fillStyle = "#88ff88";
    ctx.font = "16px alkhemikal";
    ctx.fillText("Use ← → to select, SPACE to move", 300, 730);

    if (this.errorMessage !== "") {
    ctx.fillStyle = "#ff0000";
    ctx.font = "32px alkhemikal";
    ctx.fillText(this.errorMessage, 500, 280);
  }
  }
}
