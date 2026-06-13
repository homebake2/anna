export default class Finale {
  constructor(manager) {
    this.manager = manager;
    this.el = null;
    this.candlesBlown = 0;
    this.totalCandles = 25;
    this.confettiRaf = null;
    this.confettiParticles = [];
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.style.background = 'radial-gradient(ellipse at 50% 60%, #1a1428 0%, #0d1b2a 100%)';

    el.innerHTML = `
      <canvas class="confetti-canvas" id="finale-confetti"></canvas>
      <div class="finale-wrap">
        <p class="finale-title" id="fn-title">С днём рождения, Аня!</p>
        <div class="cake-wrap" id="fn-cake">
          ${this._buildCakeSVG()}
          <p class="finale-instruction" id="fn-instruction">нажми на торт, чтобы задуть свечи</p>
        </div>
        <div class="finale-letter" id="fn-letter">
          <p>
            Аня - ты самое дорогое что у меня есть, я благодарен за каждый момент с тобой, хорошего тебе отпуска, крутых впечатлений, жду тебя дома
          </p>
          <p class="sign">— с любовью ♥</p>
        </div>
        <button class="btn btn-restart" id="fn-restart">Сначала ↺</button>
      </div>
    `;

    this.el = el;

    el.querySelector('#fn-cake').addEventListener('pointerup', () => this._blowCandles());
    el.querySelector('#fn-restart').addEventListener('pointerup', () => {
      cancelAnimationFrame(this.confettiRaf);
      this.manager.goTo(0);
    });

    requestAnimationFrame(() => this._animate());
    return el;
  }

  _buildCakeSVG() {
    const flames = [];
    for (let i = 0; i < this.totalCandles; i++) {
      const x = 18 + (i % 13) * 20;
      const row = Math.floor(i / 13);
      const y = 60 - row * 22;
      flames.push(`
        <g class="candle-group" data-index="${i}">
          <rect x="${x - 2}" y="${y}" width="4" height="14" fill="#f5f0eb" rx="1"/>
          <ellipse class="candle-flame" cx="${x}" cy="${y - 3}" rx="3.5" ry="5"
            fill="url(#flameGrad)" opacity="1"/>
        </g>
      `);
    }

    return `
    <svg class="cake-svg" viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stop-color="#fffde7"/>
          <stop offset="50%" stop-color="#ffb74d"/>
          <stop offset="100%" stop-color="#e8c97a" stop-opacity="0.3"/>
        </radialGradient>
        <linearGradient id="cakeTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9748a"/>
          <stop offset="100%" stop-color="#a85a72"/>
        </linearGradient>
        <linearGradient id="cakeMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5f0eb"/>
          <stop offset="100%" stop-color="#e8e0d8"/>
        </linearGradient>
        <linearGradient id="cakeBot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9748a"/>
          <stop offset="100%" stop-color="#a85a72"/>
        </linearGradient>
      </defs>

      <!-- Candles area -->
      ${flames.join('')}

      <!-- Top tier -->
      <rect x="60" y="80" width="160" height="40" rx="4" fill="url(#cakeTop)"/>
      <rect x="60" y="80" width="160" height="8" rx="4" fill="#e8c97a" opacity="0.6"/>
      <text x="140" y="106" text-anchor="middle" fill="white" font-size="11" font-family="Georgia,serif" opacity="0.9">25 лет ♥</text>

      <!-- Mid tier -->
      <rect x="30" y="120" width="220" height="50" rx="4" fill="url(#cakeMid)"/>
      <rect x="30" y="120" width="220" height="8" rx="4" fill="#c9748a" opacity="0.5"/>
      <!-- Dots decoration -->
      ${[50,90,130,170,210].map(x => `<circle cx="${x}" cy="150" r="4" fill="#c9748a" opacity="0.6"/>`).join('')}

      <!-- Bottom tier -->
      <rect x="10" y="170" width="260" height="40" rx="4" fill="url(#cakeBot)"/>
      <rect x="10" y="170" width="260" height="8" rx="4" fill="#e8c97a" opacity="0.5"/>
      <!-- Swirls -->
      ${[40,90,140,190,240].map(x => `<text x="${x}" y="196" text-anchor="middle" fill="white" font-size="10" opacity="0.5">✦</text>`).join('')}

      <!-- Plate -->
      <ellipse cx="140" cy="210" rx="140" ry="8" fill="#0d1b2a" opacity="0.4"/>
    </svg>
    `;
  }

  _animate() {
    const title = this.el.querySelector('#fn-title');
    const cake = this.el.querySelector('#fn-cake');

    const tl = gsap.timeline();
    tl.to(title, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.3)
      .to(cake, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' }, 0.7);
  }

  _blowCandles() {
    if (this.candlesBlown > 0) {
      return;
    }

    const instruction = this.el.querySelector('#fn-instruction');
    gsap.to(instruction, { opacity: 0, duration: 0.3 });

    const flames = this.el.querySelectorAll('.candle-flame');
    flames.forEach((flame, i) => {
      setTimeout(() => {
        gsap.to(flame, {
          opacity: 0,
          scaleY: 0,
          transformOrigin: 'bottom center',
          duration: 0.3,
          ease: 'power2.in',
        });
      }, i * 60 + Math.random() * 40);
    });

    this.candlesBlown = this.totalCandles;

    setTimeout(() => {
      this._startConfetti();
      this._showLetter();
    }, this.totalCandles * 60 + 400);
  }

  _showLetter() {
    const letter = this.el.querySelector('#fn-letter');
    const restart = this.el.querySelector('#fn-restart');

    letter.classList.add('visible');
    gsap.to(letter, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    gsap.to(restart, { opacity: 1, duration: 0.5, delay: 0.6 });
  }

  _startConfetti() {
    const canvas = this.el.querySelector('#finale-confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#e8c97a', '#c9748a', '#f5f0eb', '#7ab8e8', '#7ae8b8', '#e87a9a'];
    this.confettiParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      drift: (Math.random() - 0.5) * 1.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      this.confettiParticles.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y < canvas.height + 20) {
          alive = true;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) {
        this.confettiRaf = requestAnimationFrame(draw);
      }
    };

    draw();
  }

  destroy() {
    cancelAnimationFrame(this.confettiRaf);
  }
}
