import DialogSystem from '../engine/DialogSystem.js';

const LINES = [
  { text: 'Они любят ехать куда-то вместе. Неважно куда.' },
  { text: 'Ночь в купе — это тоже приключение.' },
  { text: 'Кыргызстан, Иссык-Куль, какие-то дюны у берега (Забыл как называются) — вот это уже масштаб.' },
  { text: 'Главное не место. Главное — с кем.' },
];

export default class Scene4 {
  constructor(manager) {
    this.manager = manager;
    this.dialog = null;
    this.el = null;
    this.slideIndex = 0;
    this.interval = null;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.innerHTML = `
      <div class="scene-bg" style="background:linear-gradient(160deg,#1c2a1a 0%,#0d1b2a 100%)"></div>
      <div class="scene-content">
        <p class="scene-chapter">Глава IV · В дороге</p>
        <div style="padding:20px 20px 0;display:flex;flex-direction:column;gap:12px;">
          <div id="s4-photos" style="opacity:0" class="split-photos">
            <div class="split-photo-wrap">
              <img src="assets/photos/6.jpg" alt="Беларусь" />
            </div>
            <div class="split-photo-wrap">
              <img src="assets/photos/2.jpg" alt="Кыргызстан" />
            </div>
          </div>
          <div id="s4-labels" style="opacity:0;display:flex;justify-content:space-between;padding:0 4px">
            <span style="font-family:var(--f-serif);font-style:italic;font-size:0.78rem;color:var(--c-white-dim)">Беларусь</span>
            <span style="font-family:var(--f-serif);font-style:italic;font-size:0.78rem;color:var(--c-white-dim)">Иссык-Куль</span>
          </div>
        </div>
      </div>
    `;

    this.el = el;
    this.dialog = new DialogSystem(el);

    requestAnimationFrame(() => this._animate());
    return el;
  }

  _animate() {
    const photos = this.el.querySelector('#s4-photos');
    const labels = this.el.querySelector('#s4-labels');

    const tl = gsap.timeline();
    tl.to(photos, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.3)
      .to(labels, { opacity: 1, duration: 0.5 }, 0.8)
      .add(() => {
        this.dialog.play(LINES, () => this._showNext());
      }, 1.2);
  }

  _showNext() {
    const btn = document.createElement('button');
    btn.className = 'btn btn-next';
    btn.textContent = 'Дальше →';
    btn.addEventListener('pointerup', () => this.manager.next());
    this.el.appendChild(btn);
    gsap.to(btn, { opacity: 1, duration: 0.4 });
  }

  destroy() {
    clearInterval(this.interval);
    if (this.dialog) {
      this.dialog.destroy();
    }
  }
}
