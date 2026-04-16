import globals from "./globals.js";
import { initGame } from "./game.js";

globals.canvas = document.getElementById("gameScreen");
globals.ctx = globals.canvas.getContext("2d");

//const game = Game.create(globals.canvas);
initGame(globals.canvas);