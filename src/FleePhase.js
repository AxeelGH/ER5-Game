import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";
import Inventory from "./Inventory.js";
import CombatTurn from "./CombatTurn.js";

export default class FleePhase extends CombatPhase{

   

    handleSelection(){}

    performAction(){
        const fleeResult = this.dice.evaluateFlee();

        if (fleeResult === 1) {
            console.log("You fled succesfully");
            this.fled = true;
        } else if (fleeResult === 2) {
            console.log("You fled but received damage");
            this.player.hp -= 5 + this.dice.rollDice(6);
            this.fled = true;
        } else {
            console.log("You failed to flee and received damage")
            this.player.hp -= 10 + this.dice.rollDice(6);
            this.fled = false;
        }

        if (this.fled === true) {
            this.echoesOfTheCoward();
        }

        this.state = "resolve";
    }

    resolve(){
    this.state = "end";
    }

   
    
    echoesOfTheCoward() {

        let result;
        if (globals.inventory.potions >= 1){
            result = Math.floor(Math.random()*3)+1;
        } else {
            result = Math.floor(Math.random()*2)+1;
        }

        console.log(globals.inventory.potions);

        if (result === 1) {
            this.enemy.maxHp += 20;
            this.enemy.hp += 20;
            console.log("The enemy has seen you flee and has become more confident and arrogant; its maximum health has increased!");
        } else if (result === 2) {
            globals.player.maxHp -=10;

            if (this.player.hp > this.player.maxHp) {
                this.player.hp = this.player.maxHp;
            }

            console.log("Your cowardice has made you lose confidence in yourself, and you've lost 10 points of maximum health by fleeing from battle!");
        } else {
            globals.inventory.removePotion();
            console.log("You stumbled while trying to flee and lost a potion!");
        }
    }
}