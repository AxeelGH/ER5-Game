import globals from "../config/globals.js";
import CombatPhase from "./CombatPhase.js";

export default class MovePhase extends CombatPhase {
  constructor(player, enemies, dice, combatTurn) {
    super(player, enemies, dice, combatTurn);
    this.movePositions = [100, 250, 450];
    this.selectedIndex = 1;
    this.targetX = null;
}

  init() {
    this.state = "waiting";
    console.log("Move phase - select position with LEFT/RIGHT, confirm with SPACE");
  }

  handleInput() {
    if (globals.action.moveLeft) {
      globals.action.moveLeft = false;
      this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : this.movePositions.length - 1;
      console.log("Position: " + this.getPositionName());
    }

    if (globals.action.moveRight) {
      globals.action.moveRight = false;
      this.selectedIndex = this.selectedIndex < this.movePositions.length - 1 ? this.selectedIndex + 1 : 0;
      console.log("Position: " + this.getPositionName());
    }

    if (globals.action.confirm) {
      globals.action.confirm = false;
      this.state = "executing";
    }
  }

  execute() {
    this.targetX = this.movePositions[this.selectedIndex];
    console.log("Moving player to position: " + this.targetX);

    if (this.player) {
      this.player.xPos = this.targetX;
      this.player.state = 4;
      this.player.animationTimer = 20;

      if (globals.ParticleSystem) {
        globals.ParticleSystem.createExplosion(this.targetX, 340, 0.5);
      }
    }

    this.state = "completed";
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
    ctx.fillRect(150, 400, 500, 150);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 400, 500, 150);

    ctx.fillStyle = "white";
    ctx.font = "24px alkhemikal";
    ctx.textAlign = "center";
    ctx.fillText("CHOOSE POSITION TO MOVE:", 400, 440);

    const positionsText = ["LEFT", "CENTER", "RIGHT"];
    const positionsX = [250, 400, 550];

    for (let i = 0; i < positionsText.length; i++) {
      if (i === this.selectedIndex) {
        ctx.fillStyle = "yellow";
        ctx.font = "bold 20px alkhemikal";
        ctx.fillText("> " + positionsText[i] + " <", positionsX[i], 490);
      } else {
        ctx.fillStyle = "white";
        ctx.font = "20px alkhemikal";
        ctx.fillText(positionsText[i], positionsX[i], 490);
      }

      ctx.fillStyle = "#aaaaaa";
      ctx.font = "14px alkhemikal";
      ctx.fillText("(x=" + this.movePositions[i] + ")", positionsX[i], 520);
    }

    ctx.fillStyle = "#88ff88";
    ctx.font = "16px alkhemikal";
    ctx.fillText("Use ← → to select, SPACE to move", 400, 540);
  }
}
