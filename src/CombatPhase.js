class CombatPhase{
    constructor(player,enemy,input,dice){

        this.player = player;
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

    execute(){
        this.init();
        this.handleSelection();
        this.performAction();
        this.resolve();
        this.end();
    }
}

export default CombatPhase;