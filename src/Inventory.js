export default class Inventory {
    constructor() {
        
        this.potions = 0;
    }
    
    addPotion() {
        this.potions++;
        console.log("total potions:" + this.potions);
    }
    
    usePotion(player) {

        if (this.potions <= 0) {
            console.log("Not enough potions to use!");
            return false;
        }
        
        player.hp += 30;
        
        if (player.hp > player.maxHp) {
            player.hp = player.maxHp;
        }
        
        this.potions--;
        
        console.log("remaining potions: " + this.potions);
        return true;
    }
    
    getPotions() {
        return this.potions;
    }
}