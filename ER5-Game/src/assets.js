import globals from './globals.js';

export default class Asset {
    constructor() {}

    loadAssets() {
        console.log("Cargando activos...");
        
        let tileSet = new Image();
        
        tileSet.addEventListener("load", this, false);
        tileSet.src = "./images/spritesheet.png"; 
        globals.tileSets.push(tileSet);
        globals.assetsToLoad.push(tileSet);

        tileSet = new Image();
        tileSet.addEventListener("load", this, false);
        tileSet.src = "./images/TileSet.png"; 
        globals.tileSets.push(tileSet);
        globals.assetsToLoad.push(tileSet);
    }

    handleEvent(event) {
        switch(event.type) {
            case "load":
                this.tileSetLoader();
                break;
        }
    }

    tileSetLoader() {
        this.loadHandler();
        
        if (globals.player) {
            globals.player.imageSet.loaded = true;
            console.log("Ready to render.");
        }
    }

    loadHandler() {
        globals.assetsLoaded++;
        if (globals.assetsLoaded === globals.assetsToLoad.length) {
            console.log("Everything loaded.");
        }
    }
}