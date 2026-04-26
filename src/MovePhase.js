import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class MovePhase extends CombatPhase {
  constructor(player, enemy, input, dice) {
    super(player, enemy, input, dice);
    this.moveIndex = 0;
    this.moving = false;
    this.movePositions = [100, 250, 450];
    this.targetX = null;
  }

  handleSelection() {
    if (this.moving && this.input) {
      if (globals.action.moveLeft) {
        globals.action.moveLeft = false;
        this.moveIndex = this.moveIndex > 0 ? this.moveIndex - 1 : this.movePositions.length - 1;
      }
      if (globals.action.moveRight) {
        globals.action.moveRight = false;
        this.moveIndex = this.moveIndex < this.movePositions.length - 1 ? this.moveIndex + 1 : 0;
      }
    }
  }

  performAction() {
    console.log("Initiating move action");
    
    if (!this.moving) {
      this.moving = true;
      this.cancelled = true;
      this.showMoveOptions();
    }
  }
  
  showMoveOptions() {
    console.log("Choose position: Left (100), Center (250), Right (450)");
  }
  
  executeMove(positionIndex) {
    const targetX = this.movePositions[positionIndex];
    
    console.log("Moving player to position: " + targetX);
    
    if (this.player) {
      this.player.xPos = targetX;
      this.player.state = 4;
      this.player.animationTimer = 20;
      
      if (globals.ParticleSystem) {
        globals.ParticleSystem.createExplosion(targetX, 340, 0.5);
      }
    }
    
    this.targetX = targetX;
    this.moving = false;
    this.cancelled = false; 
    this.finished = true; 
    this.state = "end";
    
    if (globals.gameInstance && globals.gameInstance.combatTurn) {
      globals.gameInstance.combatTurn.waitingForPlayer = true;
    }
  }
  
  getMoveIndex() {
    return this.moveIndex;
  }
  
  getMovePositions() {
    return this.movePositions;
  }

  resolve() {
    console.log("Move action completed - returning to menu");
    this.state = "end";
  }
}