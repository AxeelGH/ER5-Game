export default class DamageNumbers {
  constructor() {
    this.numbers = [];
  }

  addDamageNumber(amount, x, y, isPlayer = false) {
    let damageNumber = {
      amount: amount,
      x: x,
      y: y,
      alpha: 1,
      offsetY: 0,
      isPlayer: isPlayer,
      timer: 60,
    };

    this.numbers.push(damageNumber);
  }

  update() {
    for (let i = this.numbers.length - 1; i >= 0; i--) {
      const damageNumber = this.numbers[i];
      damageNumber.timer--;
      damageNumber.offsetY -= 1.5;
      damageNumber.alpha = damageNumber.timer / 60;

      if (damageNumber.timer <= 0) {
        this.numbers.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (let i = 0; i < this.numbers.length; i++) {
      const damageNumber = this.numbers[i];
      ctx.save();
      ctx.globalAlpha = damageNumber.alpha;
      ctx.font = "bold 48px alkhemikal";
      ctx.textAlign = "center";

      ctx.fillStyle = "black";
      ctx.fillText("-" + damageNumber.amount, damageNumber.x + 2, damageNumber.y + damageNumber.offsetY + 2);

      ctx.fillStyle = damageNumber.isPlayer ? "#ff4444" : "#ffdd00";
      ctx.fillText("-" + damageNumber.amount, damageNumber.x, damageNumber.y + damageNumber.offsetY);

      ctx.restore();
    }
  }
}
