import Message from "./Message.js";

export default class MessageQueue {
  constructor() {
    this.pendingMessages = [];     
    this.pendingIndex = 0;         
    this.activeMessage = null;      
    this.completedMessages = [];    
    this.maxHistory = 4;            
  }

  push(message) {
    this.pendingMessages.push(message);
  }

  update() {
    
    if (this.activeMessage === null && this.pendingIndex < this.pendingMessages.length) {
      this.activeMessage = this.pendingMessages[this.pendingIndex];
      this.pendingIndex++;
    }

    
    if (this.activeMessage !== null) {
      this.activeMessage.updateAnimation();
      if (this.activeMessage.isFullyDisplayed()) {
        
        if (this.completedMessages.length >= this.maxHistory) {
          
          for (let i = 0; i < this.completedMessages.length - 1; i++) {
            this.completedMessages[i] = this.completedMessages[i + 1];
          }
          this.completedMessages[this.completedMessages.length - 1] = this.activeMessage;
        } else {
          this.completedMessages.push(this.activeMessage);
        }
        this.activeMessage = null; 
      }
    }
  }

  
  getDisplayMessages() {
    let result = [];
    
    for (let i = 0; i < this.completedMessages.length; i++) {
      result.push(this.completedMessages[i]);
    }
    
    if (this.activeMessage !== null) {
      result.push(this.activeMessage);
    }
    return result;
  }

  
  clear() {
    this.pendingMessages = [];
    this.pendingIndex = 0;
    this.activeMessage = null;
    this.completedMessages = [];
  }

  isBusy() {
    return this.activeMessage !== null || this.pendingIndex < this.pendingMessages.length;
  }
}