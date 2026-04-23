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
  DIE_ROLL: 5,

  //OBJECT
  OBJECT_STILL: 0,
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
  FINAL: 7
};

export const Border =[ 
  {
  //START MAP 0
  left: mapID.INVALID,
  up: mapID.INVALID,
  right: mapID.INVALID,
  down: mapID.FOREST

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
  down: mapID.RIDE

},
{
  //CASTLE 3
  left: mapID.VILLAGE,
  up: mapID.INVALID,
  right: mapID.INVALID,
  down: mapID.INVALID
},
{
  //RIDE 4
  left: mapID.INVALID,
  up: mapID.VILLAGE,
  right: mapID.INVALID,
  down: mapID.CEMETERY
},
{
  //CEMETERY 5
  left: mapID.INVALID,
  up: mapID.RIDE,
  right: mapID.INVALID,
  down: mapID.FINAL
},
{
  //Beach 6
  left: mapID.CEMETERY,
  up: mapID.INVALID,
  right: mapID.INVALID,
  down: mapID.INVALID
},
{
  //Final 7
  left: mapID.INVALID,
  up: mapID.CEMETERY,
  right: mapID.INVALID,
  down: mapID.INVALID
}
];