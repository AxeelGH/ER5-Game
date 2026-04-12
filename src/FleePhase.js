import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class FleePhase extends CombatPhase{

    fleeResult = this.dice.evaluateFlee();

    handleSelection(){}

    performAction(){
        if(this.fleeResult === 1){
            console.log("You fled succesfully");

        } else if(this.fleeResult === 2){
            console.log("You fled but received damage");
            this.player.hp -= 10 + this.dice.rollD6();
        } else{
            console.log("You failed to flee and received damage")
            this.player.hp -= 10 + this.dice.rollD6();
        }

        this.state = "resolve";
    }

    resolve(){
    this.state = "end";
    }
}