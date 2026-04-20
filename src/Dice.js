
export default class Dice{

    rollDice(number){
        let roll = Math.floor(Math.random()*number)+1;

        return roll;
    }

    evaluateFlee(turn){
    let roll = this.rollDice(10);
    let fleeRoll = this.rollDice(10);
    console.log("Turn: " + turn);
    if (roll <= turn) {
      return 3;
    } else if (roll > turn) {
      console.log("Flee roll: " + fleeRoll);
      if (fleeRoll > 6) {
      return 1;
    } else {
      return 2;
    }
    }

    }
}

