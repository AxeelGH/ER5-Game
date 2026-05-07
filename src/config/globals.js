import { FPS, GameState, CombatState } from "./constants.js";
import { ParticleSystem } from "../particles/Particles.js";
import DamageNumbers from "../combat/DamageNumbers.js";

export default {
  canvas: {},
  ctx: {},
  previousCycleMilliseconds: 0,
  deltaTime: 0,
  cycleRealTime: 0,
  frameTimeObj: 1 / FPS,
  gameInstance: 0,
  gameState: GameState.INVALID,
  combatState: CombatState.INVALID,

  action: {},

  menuIndex: 0,
  subMenuIndex: 0,
  difficulty: "easy",

  tileSet: {},
  tileSets: [],

  assetsToLoad: [],
  assetsLoaded: 0,

  sprites: [],
  player: null,
  map: null,

  enemies: [],
  items: [],
  currentEnemy: null,
  triedToFlee: false,

  item: null,
  inventory: null,
  potionDrops: [],

  ParticleSystem: new ParticleSystem(),

  sounds: [],

  currentSound: -1,
  menuIndex: 0,

  buttonStart: {},
  buttonStartClicked: false,

  currentScreen: null,
  currentEnemies: null,
  userName: "",

  damageNumbers: new DamageNumbers(),
  gameStats : null,
};
