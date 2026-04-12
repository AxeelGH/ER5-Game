import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";


export default class AttackPhase extends CombatPhase{



    handleSelection(){}



    performAction(){
        console.log("Executing attack");

        const damage = 10 + this.dice.rollD6() + this.dice.rollD6();
        this.enemy.hp -= damage;

        console.log("Damage: " +  damage);

        this.state = "resolve";
    }

    resolve(){
        console.log("Resolving attack");

        if(this.enemy.hp <=0){
            this.enemy.isAlive = false;
            console.log("Enemy defeated");
        }

        this.state="end";
    }
    }




