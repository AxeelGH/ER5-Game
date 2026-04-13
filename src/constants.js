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

export const Tile = {
    
    SIZE_16: 0,
    SIZE_32: 1,
};

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
    STILL_LEFT:  -3,
    LEFT:        1,
    STILL_RIGHT: -2,
    RIGHT:       2,
    STILL_UP:    -1,
    UP:          3,
    STILL_DOWN:  -4,
    DOWN:        0,

    //PLAYER COMBAT
    ATTACK:      0,
    ATTACK_2:    1,
    DEFENSE:    2,

    //ENEMY
    ENEMY_STILL: 2,
    ENEMY_ATTACK_1: 0,
    ENEMY_ATTACK_2: 1,

    //SLIME
    SLIME_STILL: 0,
    //SLIME_ATTACK_1:0,
    //SLIME_ATTACK_2: 1,

    //SKELETON
    SKELETON_STILL: 0,
    //SKELETON_ATTACK_1: 0,
    //SKELETON_ATTACK_2: 1,

    //DIE
    DIE_1: 0,
    DIE_2: 1,
    DIE_3: 2,
    DIE_4: 2,
    DIE_5: 3,
    DIE_6: 4,
    DIE_ROLL: 5
}

export const Key = {
    UP:     87,       //w
    LEFT:   65,       //a
    DOWN:   83,       //s
    RIGHT:  68,       //d
    INVENTORY:   69,  //e
    CONFIRM: 13,      //enter
}