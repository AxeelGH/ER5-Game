export const Game = {
    INVALID: -1,        
    LOADING: 0,         
    INTRO: 1,           
    MENU: 2,            
    PLAYING: 3,           
    SETTINGS: 4,        
    HISTORY: 5,            
    COMBAT: 6,          
    GAME_OVER: 7,       
    PAUSE: 8,         
    HIGHSCORE: 9,      
    INSERT_NAME: 10,    
    VICTORY: 11         
};

export const FPS = 60; 

export const State = {

    //PLAYER
    STILL_LEFT:  0,
    LEFT:        1,
    STILL_RIGHT: 2,
    RIGHT:       3,
    STILL_UP:    4,
    UP:          5,
    STILL_DOWN: 6,

    //PLAYER COMBAT
    STILL_LEFT:  0,
    ATTACK:      1,
    ATTACK_2:    2,
    DEFENSE:     3,

    //ENEMY
    STILL: 0,

    //ENEMY COMBAT
    STILL_RIGHT:  0,
    ATTACK_1:      1,
    ATTACK_2:    2,

    //POTIONS
    STILL: 0,

    //DIE
    DIE_1: 0,
    DIE_2: 1,
    DIE_3: 2,
    DIE_4: 3,
    DIE_5: 4,
    DIE_6: 5,
    DIE_ROLL: 6
}

export const Key = {

    UP:     87,       //w
    LEFT:   65,       //a
    DOWN:   83,       //s
    RIGHT:  68,       //d
    INVENTORY:   69,       //e
    CONFIRM: 13,      //enter
}