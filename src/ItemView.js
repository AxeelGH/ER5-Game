import globals from "./globals.js";
import { Tile } from "./constants.js";

export default class ItemView {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render() {
    const item = globals.item;
    if (!item) return;

    const img = globals.tileSets[2];
    if (!img || !img.complete) return;

    const xPos = Math.floor(item.xPos);
    const yPos = Math.floor(item.yPos);

    this.ctx.drawImage(img, 0, 0, item.imageSet.xSize, item.imageSet.ySize, xPos, yPos, item.imageSet.xSize, item.imageSet.ySize);
  }

  drawSpriteRectangle() {
    const item = globals.item;
    const x = Math.floor(item.xPos);
    const y = Math.floor(item.yPos);
    this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
    this.ctx.fillRect(x, y, item.hitBox.xSize, item.hitBox.ySize);
  }

  drawHitBox() {
    const item = globals.item;
    const x = Math.floor(item.xPos) + item.hitBox.xOffset;
    const y = Math.floor(item.yPos) + item.hitBox.yOffset;
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, item.hitBox.xSize, item.hitBox.ySize);
  }
}
