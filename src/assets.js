import globals from './globals.js';
import {updateMusic} from './Music.js';

export default class Asset {
    constructor() {}

    loadAssets() {
        console.log("Cargando activos...");
        
        var tileSet = new Image();
        tileSet.addEventListener("load", this.tileSetLoader.bind(this));
        tileSet.addEventListener("error", this.tileSetLoader.bind(this));
        tileSet.src = "./images/spritesheet.png"; 
        globals.tileSets[0] = tileSet;
        globals.assetsToLoad.push(tileSet);

        tileSet = new Image();
        tileSet.addEventListener("load", this.tileSetLoader.bind(this));
        tileSet.addEventListener("error", this.tileSetLoader.bind(this));
        tileSet.src = "./images/TileSet.png"; 
        globals.tileSets[1] = tileSet;
        globals.assetsToLoad.push(tileSet);

        tileSet = new Image();
        tileSet.addEventListener("load", this.tileSetLoader.bind(this));
        tileSet.addEventListener("error", this.tileSetLoader.bind(this));
        tileSet.src = "./images/potion_life.png"; 
        globals.tileSets[2] = tileSet;
        globals.assetsToLoad.push(tileSet);

     
        let startMusic = document.querySelector("#startMusic");
        startMusic.addEventListener("canplaythrough", this.tileSetLoader, false);
        startMusic.addEventListener("timeupdate",updateMusic, false);
        startMusic.load();
        globals.sounds.push(startMusic);
        globals.assetsToLoad.push(startMusic);
    }

    tileSetLoader() {
        globals.assetsLoaded++;
        if (globals.assetsLoaded === globals.assetsToLoad.length) {
            console.log("Everything loaded.");
            if (globals.player) {
                globals.player.imageSet.loaded = true;
            }

            for(let i = 0; i < globals.sounds.length;i++){
                globals.sounds[i].removeEventListener("canplaythrough",this.tileSetLoader,false);
            }
        }
    }
}