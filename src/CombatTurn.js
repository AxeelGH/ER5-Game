import globals from "./globals.js";
import Dice from "./Dice.js";
import AbilityPhase from "./AbilityPhase.js";
import AttackPhase from "./AttackPhase.js";
import InventoryPhase from "./InventoryPhase.js";
import FleePhase from "./FleePhase.js";
import { GameState } from "./constants.js";


export default class CombatTurn{
    dice = new Dice();
    constructor(player, enemy,input ) {
        this.player = player;
        this.enemy = enemy;
        this.input = input;

        this.currentPhase = null;
        this.turnEnd = false;

        //Combat index
        this.phaseIndex = 0;
        this.phases = ["Attack", "Ability", "Inventory", "Flee"];

        this.initPhases();
    }

    initPhases() {
        this.combatPhases ={
            Attack: new AttackPhase(this.player, this.enemy, this.input, this.dice),
            Ability: new AbilityPhase(this.player, this.enemy, this.input, this.dice),
            Inventory: new InventoryPhase(this.player, this.enemy, this.input, this.dice),
            Flee: new FleePhase(this.player, this.enemy, this.input, this.dice),
        };
    }

    
    combatMenu() {

        if(globals.action.moveUp){
            globals.action.moveUp = false;
            this.phaseIndex = (this.phaseIndex > 0) ? this.phaseIndex -1: this.phases.length -1;
        }
        if(globals.action.moveDown){
            globals.action.moveDown = false;
            this.phaseIndex = (this.phaseIndex < this.phases.length -1) ? this.phaseIndex +1 : 0;
        }
        
        if(globals.action.confirm){
            globals.action.confirm = false;

            const selectedPhase = this.phases[this.phaseIndex];
            console.log("Selected phase: " + selectedPhase);

            this.currentPhase = this.combatPhases[selectedPhase];
            this.executePhase();
        }

        
    }

    executePhase() {      
        this.currentPhase.execute();

        if(this.currentPhase.fled){
            this.endCombat();
            return;
        }

        if(!this.enemy.isAlive){
            this.endCombat();
            this.player.mana += 10;
            return;
        }
        this.enemyTurn();
    }

    endCombat(){
        globals.currentEnemy = null;
        globals.gameInstance.combatTurn = null;
        globals.gameInstance.gameState = GameState.PLAYING;
        globals.gameState = GameState.PLAYING;
    }

    enemyTurn(){
        const damage = 10+ this.dice.rollD6();

        this.player.hp -= damage;

        if (this.player.hp <= 0) {
        this.player.hp = 0;
        globals.gameInstance.combatTurn = null;
        globals.gameInstance.gameState = GameState.GAME_OVER;
        globals.gameState = GameState.GAME_OVER;
    }
    }

    finishTurn(){
       this.turnEnd = true;
    }

    nextTurn(){

        this.currentPhase = null;
        this.turnEnd = false;

        this.initPhases();
    }
}