export default class Message {
  constructor(text, type) {
    this.fullText = text;
    this.type = type;
    this.displayedLength = 0;
    this.isComplete = false;
    this.charDelay = 5;          //Adjust the speed of the text animation, lower is faster
    this.timer = this.charDelay;
  }

  updateAnimation() {
    
    if (this.timer > 0) {
      this.timer--;
    } else {
      this.displayedLength++;
      this.timer = this.charDelay;
      if (this.displayedLength >= this.fullText.length) {
        this.isComplete = true;
      }
    }
  }

  getCurrentText() {
    return this.fullText.substring(0, this.displayedLength);
  }

  isFullyDisplayed() {
    return this.isComplete;
  }

  getColor() {
    switch(this.type) {
      case 'damage':   return '#ff5555';
      case 'heal':     return '#55ff55';
      case 'critical': return '#ffaa00';
      case 'flee':     return '#cccccc';
      case 'error':    return '#ff0000';
      case 'move':     return '#88ccff';
      case 'ability':  return '#cc88ff';
      default:         return '#ffffff';
    }
  }
}