import DialogSystem from '../engine/DialogSystem.js';

const LINES = [
  { text: 'Первое свидание (Хоть это и не обговаривалось). Поехали к морю в Севастополь.' },
  { text: 'По дороге застряли в Залупке' },
  { text: 'Очень романтично плавали под луной. По-настоящему романтично — ночь, море, тишина. (Немного медуз и платье твоей сесты)' },
  { text: 'Кто же знал что не надо ставить машину в горку. Ехали домой на эвакуаторе.' },
  { text: 'После той ночи они долго не общались. Но она их явно сблизила.' },
];

export default class Scene2 {
  constructor(manager) {
    this.manager = manager;
    this.dialog = null;
    this.el = null;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.innerHTML = `
      <div class="scene-bg" style="background: radial-gradient(ellipse at 50% 100%, #0a1628 0%, #050d18 60%);"></div>
      <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><defs><radialGradient id=%22m%22 cx=%2250%25%22 cy=%2285%25%22 r=%2240%25%22><stop offset=%220%22 stop-color=%22%23e8c97a%22 stop-opacity=%220.12%22/><stop offset=%221%22 stop-color=%22transparent%22/></radialGradient></defs><rect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23m)%22/></svg>') no-repeat center"></div>
      <div class="scene-content">
        <p class="scene-chapter">Глава II · То самое свидание</p>
        <div style="padding: 20px 20px 0; display:flex; flex-direction:column; gap: 16px; align-items:center;">
          <div id="s2-moon" class="moon-interactive" style="position:relative;margin:0 auto">
            <div class="moon-circle"></div>
          </div>
          <div id="s2-photo-wrap" style="opacity:0; width:100%;">
            <div class="photo-card" style="width:min(260px,72vw);margin:0 auto;transform:rotate(-2deg)">
              <img src="assets/photos/10.jpg" alt="Та самая ночь" style="width:100%;aspect-ratio:4/3;object-fit:cover" />
              <span class="photo-caption">та самая ночь</span>
            </div>
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
    const moon = this.el.querySelector('#s2-moon');
    const photoWrap = this.el.querySelector('#s2-photo-wrap');

    gsap.set(moon, { opacity: 0, y: 20 });
    gsap.to(moon, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.4 });

    moon.addEventListener('pointerup', () => {
      gsap.to(moon, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
      gsap.to(photoWrap, { opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' });
      moon.style.pointerEvents = 'none';
      setTimeout(() => {
        this.dialog.play(LINES, () => this._showNext());
      }, 600);
    });
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
    if (this.dialog) {
      this.dialog.destroy();
    }
  }
}
