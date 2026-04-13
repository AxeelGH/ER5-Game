import globals from './globals.js';

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
        const colors = [
            `rgba(255, 50, 50, ${this.alpha})`
        ];
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
            
            const particle = new ExplosionParticle(
                this.nextId++,
                x,
                y,
                radius,
                alpha,
                vx,
                vy
            );
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
        for (const particle of this.particles) {
            particle.draw(ctx);
        }
    }

    clear() {
        this.particles = [];
    }
}