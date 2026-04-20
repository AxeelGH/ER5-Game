export default class Dice{

    rollDice(number){
        let roll = Math.floor(Math.random()*number)+1;

        return roll;
    }

    evaluateFlee(){
        
    const roll = this.rollDice(10);
    let result;

      if(roll === 1 || roll === 2 ){
        result = 1
      } else if (roll === 3 || roll === 4) {
        result = 2;
      } else {
        result = 3;
      }

      return result;
    }
}

