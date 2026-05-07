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
  VICTORY: 11,
  LOGIN: 12,
  LOGIN_LOADING: 13,
  LOAD_SCREEN: 14,
  DIFFICULTY: 15,
  INIT_COMBAT: 16,
  CINEMATIC: 17,
};

export const FPS = 60;

export const Tile = {
  SIZE_16: 0,
  SIZE_32: 1,
};

//IDENTIFY ID SPRITE
export const SpriteID = {
  HERO: 0,
  HERO2: 1,
  SLIME: 2,
  SKELETON: 3,
  MAGE: 4,
  OBJECT: 5,
  SUPER_SLIME: 6,
  SUPER_MAGE: 7,
  SUPER_SKELETON: 8,
};

export const State = {
  //PLAYER MOVEMENT
  STILL_LEFT: -3,
  LEFT: 1,
  STILL_RIGHT: -2,
  RIGHT: 2,
  STILL_UP: -1,
  UP: 3,
  STILL_DOWN: -4,
  DOWN: 0,

  //PLAYER COMBAT
  ATTACK: 0,
  ATTACK_2: 1,
  DEFENSE: 2,

  //ENEMY
  ENEMY_STILL: 2,
  ENEMY_ATTACK_1: 0,
  ENEMY_ATTACK_2: 1,

  //SLIME
  SLIME_STILL: 0,
  SLIME_ATTACK_1: 1,
  SLIME_ATTACK_2: 2,

  //SKELETON
  SKELETON_STILL: 0,
  //SKELETON_ATTACK_1: 0,
  //SKELETON_ATTACK_2: 1,

  //SUPER SLIME
  SUPER_SLIME_STILL: 0,
  SUPER_SLIME_MOVE: 1,
  SUPER_SLIME_ATTACK: 2,
  SUPER_SLIME_HIT: 3,
  SUPER_SLIME_DEAD: 4,

  //SUPER MAGE
  SUPER_MAGE_STILL: 0,
  SUPER_MAGE_HIT: 1,
  SUPER_MAGE_ATTACK: 5,

  // SUPER SKELETON
  SUPER_SKELETON_STILL: 0,
  SUPER_SKELETON_ATTACK: 1,
  SUPER_SKELETON_HIT: 2,

  //DIE
  DIE_1: 0,
  DIE_2: 1,
  DIE_3: 2,
  DIE_4: 2,
  DIE_5: 3,
  DIE_6: 4,
  DIE_ROLL: 5,

  //OBJECT
  OBJECT_STILL: 0,

  COMBAT_MOVE_1: 5,
  COMBAT_MOVE_2: 6,
  COMBAT_MOVE_3: 7,
};

export const Key = {
  UP: 87, //w
  LEFT: 65, //a
  DOWN: 83, //s
  RIGHT: 68, //d
  INVENTORY: 69, //e
  CONFIRM: 32, //Space
};

export const Sound = {
  NO_MUSIC: -1,
  START_MUSIC: 0,
};

export const LoginData = "https://er5game.free.laravel.cloud/api/login";

export const mapID = {
  INVALID: -1,
  START: 0,
  FOREST: 1,
  VILLAGE: 2,
  CASTLE: 3,
  RIDE: 4,
  CEMETERY: 5,
  BEACH: 6,
  FINAL: 7,
};

export const Border = [
  {
    //START MAP 0
    left: mapID.INVALID,
    up: mapID.INVALID,
    right: mapID.INVALID,
    down: mapID.FOREST,
  },
  {
    //FOREST 1
    left: mapID.INVALID,
    up: mapID.START,
    right: mapID.VILLAGE,
    down: mapID.INVALID,
  },
  {
    //VILLAGE 2
    left: mapID.FOREST,
    up: mapID.INVALID,
    right: mapID.CASTLE,
    down: mapID.RIDE,
  },
  {
    //CASTLE 3
    left: mapID.VILLAGE,
    up: mapID.INVALID,
    right: mapID.INVALID,
    down: mapID.INVALID,
  },
  {
    //RIDE 4
    left: mapID.INVALID,
    up: mapID.VILLAGE,
    right: mapID.INVALID,
    down: mapID.CEMETERY,
  },
  {
    //CEMETERY 5
    left: mapID.INVALID,
    up: mapID.RIDE,
    right: mapID.BEACH,
    down: mapID.FINAL,
  },
  {
    //Beach 6
    left: mapID.CEMETERY,
    up: mapID.INVALID,
    right: mapID.INVALID,
    down: mapID.INVALID,
  },
  {
    //Final 7
    left: mapID.INVALID,
    up: mapID.CEMETERY,
    right: mapID.INVALID,
    down: mapID.INVALID,
  },
];

export const CombatState = {
  INVALID: -1,
  INIT_COMBAT: 0,
  PLAY_TURN: 1,
  END_COMBAT: 2
}
