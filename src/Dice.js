export default class Dice{

    rollD6(){
        let roll = Math.floor(Math.random()*6)+1;

        return roll;
    }
}

