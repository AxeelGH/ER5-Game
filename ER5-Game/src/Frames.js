export default class Frames{

    constructor(framesPerState, speed = 1){

        this.framesPerState = framesPerState;   // Number of frames per state
        this.frameCounter = 0;                  // Current frame index
        this.speed = speed;                     // Speed of animation
        this.frameChangeCounter = 0;            // Counter to control frame change timing
    }
}