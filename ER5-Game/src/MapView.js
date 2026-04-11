import globals from './globals.js';

export default class MapView{

    constructor(ctx) {
        this.ctx = ctx;
    }

    render() {
        const map = globals.map;
        const brickSize = map.imageSet.gridSize;
        const levelData = map.data;

        const img = globals.tileSets[1]; 

        if (!img) return;

        const num_fil = levelData.length;
        const num_col = levelData[0].length;

        for (let i = 0; i < num_fil; ++i) {
            for (let j = 0; j < num_col; ++j) {
                const tileValue = levelData[i][j];

                if (tileValue <= 0) continue;

                const xTile = (levelData[i][j] - 1) * brickSize;
                const yTile = 0;

                const xPos = j * brickSize;
                const yPos = i * brickSize;

                this.ctx.drawImage(
                    img,
                    xTile, yTile,         
                    brickSize, brickSize, 
                    xPos, yPos,           
                    brickSize, brickSize  
                );
            }
        }
    }
}