import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class InventoryPhase extends CombatPhase{


    handleSelection(){}

    performAction(){
        console.log("use item");
        
        if (globals.inventory && globals.inventory.getPotions() > 0) {
            globals.inventory.usePotion(this.player);
            console.log("You used a potion, gained 30 HP");
           
        } else {
            console.log("Error: No inventory found");
           
        }

        this.cancelled = true;
        this.state = "resolve";
    }

    resolve(){

        this.state = "end";
    }
    

}