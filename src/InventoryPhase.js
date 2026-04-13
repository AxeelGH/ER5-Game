import globals from "./globals.js";
import CombatPhase from "./CombatPhase.js";

export default class InventoryPhase extends CombatPhase{


    handleSelection(){}

    performAction(){
        console.log("use item");
        
        if (globals.inventory) {
            globals.inventory.usePotion(this.player);
        } else {
            console.log("Error: No inventory found");
        }
        
        this.state = "resolve";
    }

    resolve(){

        this.state = "end";
    }
    

    resolve(){}
}