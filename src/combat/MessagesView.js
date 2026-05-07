export default class MessagesView {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 380; 
    this.y = 640; 
    this.lineHeight = 28;
  }

  render(messageQueue) {
  
    const messages = messageQueue.getMessages();

    this.ctx.save();
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = "24px alkhemikal";
      this.ctx.textAlign = "left";
      this.ctx.fillText(msg.getDisplayText(), this.x, this.y + i * this.lineHeight);
    }

    this.ctx.restore();
  }
}