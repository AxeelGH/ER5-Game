class CombatPhase{
    constructor(hero,enemy,input,dice){

        this.hero = hero;
        this.enemy = enemy;
        this.input = input;
        this.dice = dice;

        this.state = "init";
        this.finished = false;
    }


    init(){
        this.state = "select";
    }

    
    handleSelection(){

    }

    performAction(){

    }

    resolve(){

    }

    end(){
        this.finished = true;
    }

    isFinished(){
        return this.finished;
    }
}

export default CombatPhase;