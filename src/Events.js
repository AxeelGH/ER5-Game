import globals from './globals.js';
import { Key } from './constants.js';

export class Events {

    constructor() {
        
        this.initEvents();
    }

    initEvents() {

        globals.buttonStart = document.getElementById('btnStart');
        
        if (globals.buttonStart) {
            globals.buttonStart.addEventListener("click", this.btnStartClick, false);
            globals.buttonStart.addEventListener("mouseout", this.btnStartOut, false);
        } else {
            console.warn("btnStart not found in DOM");
        }
        
        window.addEventListener("keydown", this.keyDown, false);
        window.addEventListener("keyup", this.keyUp, false);
    }

    keyDown(event) {
        
        switch (event.keyCode) {
            case Key.UP:
                globals.action.moveUp = true;
                break;

            case Key.DOWN:
                globals.action.moveDown = true;
                break;

            case Key.LEFT:
                globals.action.moveLeft = true;
                break;

            case Key.RIGHT:
                globals.action.moveRight = true;
                break;

            case Key.CONFIRM:
                globals.action.confirm = true;
                break;
        }
    }

    keyUp(event) {

        switch (event.keyCode) {
            case Key.UP:
                globals.action.moveUp = false;
                break;

            case Key.DOWN:
                globals.action.moveDown = false;
                break;

            case Key.LEFT:
                globals.action.moveLeft = false;
                break;

            case Key.RIGHT:
                globals.action.moveRight = false;
                break;

            case Key.CONFIRM:
                globals.action.confirm = false;
                break;
        }
    }

    btnStartOut(event){

        document.getElementById("btnStart").innerHTML = "START";
    }

    btnStartClick(event) {
        console.log("START button clicked");
        globals.buttonStart.clicked = true;
    
        if (globals.gameState === 12) {
            globals.action.confirm = true;
        } 
    }
}
