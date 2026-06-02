import globals from "../config/globals.js";

class Particle {
  constructor(id, xPos, yPos, radius, alpha, vx, vy) {
    this.id = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.alpha = alpha;
    this.vx = vx;
    this.vy = vy;
    this.life = 1.0;
    this.decay = 0.02;
  }

  update() {
    this.xPos += this.vx;
    this.yPos += this.vy;
    this.life -= this.decay;
    this.alpha = this.life * 0.8;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = this.getColor();
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getColor() {
    return `rgba(255, 100, 0, ${this.alpha})`;
  }
}

export class ExplosionParticle extends Particle {
  constructor(id, xPos, yPos, radius, alpha, vx, vy) {
    super(id, xPos, yPos, radius, alpha, vx, vy);
    this.decay = 0.03 + Math.random() * 0.04;
  }

  getColor() {
    const colors = [`rgba(255, 50, 50, ${this.alpha})`];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.nextId = 0;
  }

  createExplosion(x, y, intensity = 1.0) {
    const particleCount = Math.floor(15 + Math.random() * 20) * intensity;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 3 + 2) * intensity;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const radius = (Math.random() * 4 + 2) * intensity;
      const alpha = 0.8;

      const particle = new ExplosionParticle(this.nextId++, x, y, radius, alpha, vx, vy);
      this.particles.push(particle);
    }

    console.log(`Created explosion at (${x}, ${y}) with ${particleCount} particles`);
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update()) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx);
    }
  }

  clear() {
    this.particles = [];
  }

  createLightningLine(x1, y1, x2, y2, intensity = 1.0) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const numParticles = Math.floor(20 + distance / 8) * intensity;
    const step = distance / numParticles;

    for (let i = 0; i <= numParticles; i++) {
      const t = i / numParticles;
      const px = x1 + dx * t;
      const py = y1 + dy * t;
      const radius = (Math.random() * 5 + 4) * intensity;
      const offsetX = (Math.random() - 0.5) * 5;
      const offsetY = (Math.random() - 0.5) * 5;
      const particle = new LineParticle(this.nextId++, px + offsetX, py + offsetY, radius, 0.9, 0, 0, 0.25);
      this.particles.push(particle);
    }

    const glowCount = Math.floor(numParticles * 0.8);
    for (let i = 0; i <= glowCount; i++) {
      const t = i / glowCount;
      const px = x1 + dx * t;
      const py = y1 + dy * t;
      const radius = (Math.random() * 10 + 8) * intensity;
      const offsetX = (Math.random() - 0.5) * 12;
      const offsetY = (Math.random() - 0.5) * 12;
      const particle = new LineParticle(this.nextId++, px + offsetX, py + offsetY, radius, 0.4, 0, 0, 0.2);
      this.particles.push(particle);
    }

    const perpX = -dy / distance;
    const perpY = dx / distance;
    for (let s = -1; s <= 1; s += 2) {
      const offsetMultiplier = 8;
      const subCount = Math.floor(numParticles / 2);
      for (let i = 0; i <= subCount; i++) {
        const t = i / subCount;
        const px = x1 + dx * t;
        const py = y1 + dy * t;
        const offsetX = perpX * (s * offsetMultiplier);
        const offsetY = perpY * (s * offsetMultiplier);
        const radius = (Math.random() * 4 + 2) * intensity;
        const particle = new LineParticle(this.nextId++, px + offsetX, py + offsetY, radius, 0.7, 0, 0, 0.2);
        this.particles.push(particle);
      }
    }

    const sparkCount = Math.floor(20 * intensity);
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const radius = (Math.random() * 4 + 2) * intensity;
      const particle = new LightningParticle(this.nextId++, x2, y2, radius, 0.8, vx, vy);
      this.particles.push(particle);
    }

    this.createExplosion(x2, y2, intensity * 0.8);
  }

  createMagicBolt(fromX, fromY, toX, toY, intensity = 1.0) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const numParticles = Math.floor(8 + Math.random() * 5) * intensity;

    for (let i = 0; i < numParticles; i++) {
      const t = Math.random();
      const px = fromX + dx * t;
      const py = fromY + dy * t;

      const speed = (Math.random() * 3 + 2) * intensity;
      const vx = (dx / distance) * speed + (Math.random() - 0.5) * 1.5;
      const vy = (dy / distance) * speed + (Math.random() - 0.5) * 1.5;
      const radius = (Math.random() * 3 + 2) * intensity;
      const alpha = 0.8;
      const particle = new MagicParticle(this.nextId++, px, py, radius, alpha, vx, vy);
      this.particles.push(particle);
    }

    for (let i = 0; i < 6 * intensity; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const radius = (Math.random() * 2 + 1) * intensity;
      const particle = new MagicParticle(this.nextId++, toX, toY, radius, 0.6, vx, vy);
      this.particles.push(particle);
    }
  }
}

export class LightningParticle extends Particle {
  constructor(id, xPos, yPos, radius, alpha, vx, vy) {
    super(id, xPos, yPos, radius, alpha, vx, vy);
    this.decay = 0.02 + Math.random() * 0.03;
    this.trail = [];
  }

  update() {
    this.xPos += this.vx;
    this.yPos += this.vy;
    this.life -= this.decay;
    this.alpha = this.life * 0.9;
    
    if (Math.random() < 0.3) {
      this.trail.push({ x: this.xPos, y: this.yPos, life: this.life });
    }
    for (let i = this.trail.length-1; i >= 0; i--) {
      this.trail[i].life -= 0.1;
      if (this.trail[i].life <= 0) this.trail.splice(i,1);
    }
    return this.life > 0;
  }

  draw(ctx) {
    for (let t of this.trail) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, t.life * 0.5));
      ctx.fillStyle = `rgba(255, 255, 100, ${t.life * 0.5})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = `rgba(255, 255, 100, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getColor() {
    return `rgba(255, 255, 100, ${this.alpha})`;
  }
}

export class LineParticle extends Particle {
  constructor(id, xPos, yPos, radius, alpha, vx, vy, lifeTime = 0.3) {
    super(id, xPos, yPos, radius, alpha, vx, vy);
    this.decay = 1.0 / (lifeTime * 60);
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    this.life -= this.decay;
    this.alpha = this.life * 0.9;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = `rgba(255, 240, 100, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getColor() {
    return `rgba(255, 240, 100, ${this.alpha})`;
  }
}

export class MagicParticle extends Particle {
  constructor(id, xPos, yPos, radius, alpha, vx, vy) {
    super(id, xPos, yPos, radius, alpha, vx, vy);
    this.decay = 0.04;
  }

  getColor() {
    return `rgba(150, 100, 255, ${this.alpha})`;
  }
}