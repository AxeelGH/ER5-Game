import { FPS, GameState } from "./constants.js";

export default{

    canvas: {},
    ctx: {},
    previousCycleMilliseconds: 0,
    deltaTime: 0,
    cycleRealTime: 0,
    frameTimeObj: 1 / FPS,
    gameInstance: 0,   
    gameState: GameState.INVALID,
    
    //key pressed states
    action: {},

    //menu states
    menuIndex: 0,
    subMenuIndex: 0,

    //assets
    tileSet: {},
    tileSets: [],

    assetsToLoad: [],
    assetsLoaded: 0,

    sprites: [],
    player: null,
    map: null,

    enemies: [],  // Array para almacenar enemigos
    currentEnemy: null,  // Enemigo actual en combate

    object: null,
    inventory: null,
}