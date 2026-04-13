import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class FleePhase extends CombatPhase{

   

    handleSelection(){}

    performAction(){
        const fleeResult = this.dice.evaluateFlee();

        if(fleeResult === 1){
            console.log("You fled succesfully");
            this.fled = true;
        } else if(fleeResult === 2){
            console.log("You fled but received damage");
            this.player.hp -= 5 + this.dice.rollD6();
            this.fled = true;
        } else{
            console.log("You failed to flee and received damage")
            this.player.hp -= 10 + this.dice.rollD6();
            this.fled = false;
        }

        this.state = "resolve";
    }

    resolve(){
    this.state = "end";
    }
}