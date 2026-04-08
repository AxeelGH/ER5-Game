export default class Sprite{

    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox){
        
        this.id = id;
        this.state = state;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imageSet = imageSet;
        this.frames = frames;
        this.physics = physics; // Physics object
        this.hitBox = hitBox;

    }
}