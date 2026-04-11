export const GameState = {
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

//IDENTIFY ID SPRITE
export const SpriteID = {
    HERO:     0,
    HERO2:    1,
    SLIME:    2,
    SKELETON: 3,
    MAGE:     4,
}

export const State = {
    //PLAYER MOVEMENT
    // STILL_LEFT:  0,
    LEFT:        1,
    // STILL_RIGHT: 2,
    RIGHT:       2,
    // STILL_UP:    4,
    UP:          3,
    // STILL_DOWN:  6,
    DOWN:        0,

    //PLAYER COMBAT
    ATTACK:      8,
    ATTACK_2:    9,
    DEFENSE:     10,

    //ENEMY
    ENEMY_STILL: 11,
    ENEMY_ATTACK_1: 12,
    ENEMY_ATTACK_2: 13,

    //DIE
    DIE_1: 14,
    DIE_2: 15,
    DIE_3: 16,
    DIE_4: 17,
    DIE_5: 18,
    DIE_6: 19,
    DIE_ROLL: 20
}

export const Key = {
    UP:     87,       //w
    LEFT:   65,       //a
    DOWN:   83,       //s
    RIGHT:  68,       //d
    INVENTORY:   69,  //e
    CONFIRM: 13,      //enter
}