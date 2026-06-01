import globals from "./config/globals.js";
import { initStory } from "./game.js";

globals.canvas = document.getElementById("gameScreen");
globals.ctx = globals.canvas.getContext("2d");

//const game = Game.create(globals.canvas);
initStory();
//initGame(globals.canvas);
