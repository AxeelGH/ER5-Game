import globals from "../config/globals.js";

export default class MapView {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render() {
    const map = globals.map;
    const brickSize = map.imageSet.gridSize;
    const levelData = map.data;

    const img = globals.tileSets[1];

    //Calculate how many tiles per row
    const tilesPerRow = Math.floor(img.width / brickSize);

    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for (let i = 0; i < num_fil; ++i) {
      for (let j = 0; j < num_col; ++j) {
        const tileValue = levelData[i][j];

        if (tileValue <= 0) continue;

        //Calculate position in tileset
        const tileIndex = tileValue - 1;

        //Calculate row and col in tileset
        const col = tileIndex % tilesPerRow;
        const row = Math.floor(tileIndex / tilesPerRow);

        //Tileset px coordinates
        const xTile = col * brickSize;
        const yTile = row * brickSize;

        const xPos = j * brickSize;
        const yPos = i * brickSize;

        this.ctx.drawImage(img, xTile, yTile, brickSize, brickSize, xPos, yPos, brickSize, brickSize);
      }
    }
  }
}
