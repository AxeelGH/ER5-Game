import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";


export default class AbilityPhase extends CombatPhase{



    handleSelection(){}



    performAction(){
        console.log("Executing ability");

        if(this.player.mana >= 20 ){
        const damage = 20 + this.dice.rollD6() + this.dice.rollD6();
        this.enemy.hp -= damage;
        this.player.mana -= 20;

        console.log("Damage: " +  damage);
        } else { 
            console.log("Not enough mana to use ability");
        }
      

        this.state = "resolve";
    }

    resolve(){
        console.log("Resolving ability");

        if(this.enemy.hp <=0){
            this.enemy.isAlive = false;
            console.log("Enemy defeated");
        }

        this.state="end";
    }
    }