import { FPS, GameState } from "./constants.js";
import { ParticleSystem } from "./Particles.js";

export default {
  canvas: {},
  ctx: {},
  previousCycleMilliseconds: 0,
  deltaTime: 0,
  cycleRealTime: 0,
  frameTimeObj: 1 / FPS,
  gameInstance: 0,
  gameState: GameState.INVALID,

  action: {},

  menuIndex: 0,
  subMenuIndex: 0,

  tileSet: {},
  tileSets: [],

  assetsToLoad: [],
  assetsLoaded: 0,

  sprites: [],
  player: null,
  map: null,

  enemies: [],
  objects: [],
  currentEnemy: null,
  triedToFlee: false,

  object: null,
  inventory: null,
  potionDrops: [],

  ParticleSystem: new ParticleSystem(),

  sounds: [],

  currentSound: -1,

  buttonStart: {},
  buttonStartClicked: false,

  currentScreen: null,
};
