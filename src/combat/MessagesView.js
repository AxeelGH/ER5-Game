export default class MessagesView {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 380;          
    this.baseY = 640;      
    this.lineHeight = 28;   
  }

  render(messageQueue) {
    let allMessages = messageQueue.getDisplayMessages();
    
    let start = allMessages.length - 4;
    if (start < 0) start = 0;

    this.ctx.save();
    this.ctx.font = "24px alkhemikal";
    this.ctx.textAlign = "left";
    this.ctx.shadowColor = "rgba(0,0,0,0.5)";
    this.ctx.shadowBlur = 2;

    let yOffset = 0;
    for (let i = start; i < allMessages.length; i++) {
      let msg = allMessages[i];
      let text = msg.getCurrentText();    
      let color = msg.getColor();
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, this.x, this.baseY + yOffset);
      yOffset += this.lineHeight;
    }

    this.ctx.shadowColor = "transparent";
    this.ctx.restore();
  }
}