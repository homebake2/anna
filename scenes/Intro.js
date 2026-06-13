export default class Intro {
  constructor(manager) {
    this.manager = manager;
    this.el = null;
    this.particleInterval = null;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.innerHTML = `
      <div class="scene-bg" style="background: radial-gradient(ellipse at 50% 80%, #1a2d45 0%, #0d1b2a 70%)"></div>
      <div class="particles" id="intro-particles"></div>
      <div class="intro-content">
        <div class="intro-subtitle">с днём рождения</div>
        <div class="intro-name" id="intro-name"></div>
        <div class="intro-tagline">Тебе 25.<br>Давай вспомним, как мы дошли до этого момента.</div>
        <div class="intro-btn">
          <button class="btn" id="intro-start-btn">Начать ♥</button>
        </div>
      </div>
    `;

    this.el = el;

    el.querySelector('#intro-start-btn').addEventListener('pointerup', () => {
      window.__audioManager.start();
      this.manager.next();
    });

    requestAnimationFrame(() => this._animate());
    return el;
  }

  _animate() {
    const subtitle = this.el.querySelector('.intro-subtitle');
    const nameEl = this.el.querySelector('#intro-name');
    const tagline = this.el.querySelector('.intro-tagline');
    const btn = this.el.querySelector('.intro-btn');

    const name = 'Аня';
    const tl = gsap.timeline();

    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.3)
      .add(() => this._typeName(nameEl, name), 0.9)
      .to(tagline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 2.2)
      .to(btn, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 2.8);

    this._spawnParticles();
  }

  _typeName(el, text) {
    el.style.opacity = '1';
    const chars = [...text];
    let i = 0;
    const iv = setInterval(() => {
      if (i < chars.length) {
        el.textContent += chars[i];
        i++;
      } else {
        clearInterval(iv);
      }
    }, 120);
  }

  _spawnParticles() {
    const container = this.el.querySelector('#intro-particles');
    if (!container) {
      return;
    }

    const spawn = () => {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1.5;
      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 3;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
      `;
      container.appendChild(p);
      setTimeout(() => {
        if (p.parentNode) {
          p.parentNode.removeChild(p);
        }
      }, (duration + delay) * 1000 + 500);
    };

    for (let i = 0; i < 20; i++) {
      setTimeout(spawn, i * 300);
    }
    this.particleInterval = setInterval(spawn, 600);
  }

  destroy() {
    clearInterval(this.particleInterval);
  }
}
