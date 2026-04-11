export default class ImageSet{

    constructor(initFil, initCol, xSize, ySize, xOffset, yOffset, gridSize){

        this.initFil = initFil;
        this.initCol = initCol;
        this.xSize = xSize;
        this.ySize = ySize;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.gridSize = gridSize;
        this.loaded = true;
    }

    draw(ctx, x, y, frameIndex) {
        
        const img = globals.tileSets[0]; 
        
        const column = this.initCol + (frameIndex % 3); 
        const row = this.initFil + Math.floor(frameIndex / 3);

        ctx.drawImage(
            img,
            column * this.gridSize, row * this.gridSize, 
            this.xSize, this.ySize,                      
            x, y,                                        
            this.xSize, this.ySize                       
        );
    }
}