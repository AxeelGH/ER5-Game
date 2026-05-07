import Message from "./Message.js";

export default class MessageQueue {
  constructor() {
    this.messages = [];
    this.maxMessages = 4;
  }

  push(message) {
    this.messages.push(message);
    
    if (this.messages.length > this.maxMessages) {
      this.messages.splice(0, 1);
    }
  }

  clear() {
    this.messages = [];
  }

  getMessages() {
    return this.messages;
  }
}