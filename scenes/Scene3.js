import DialogSystem from '../engine/DialogSystem.js';

const LINES = [
  { text: 'Потом после дня пельменей что-то щёлкнуло.' },
  { text: 'Они начали встречаться. Ещё всё было новым — каждый жест, каждое слово.' },
  { text: 'Море снова рядом. Как будто оно всегда было частью их истории.' },
  { text: 'Просто двое — просто дача, просто котлета, и горизонт впереди.' },
];

export default class Scene3 {
  constructor(manager) {
    this.manager = manager;
    this.dialog = null;
    this.el = null;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.innerHTML = `
      <div class="scene-bg" style="background:linear-gradient(180deg,#1a3040 0%,#0d1e2e 100%)"></div>
      <div class="scene-content">
        <p class="scene-chapter">Глава III · Мы</p>
        <div style="padding:20px 20px 0;display:flex;justify-content:center">
          <div id="s3-photo" style="opacity:0;width:min(280px,80vw)">
            <div class="photo-card" style="transform:rotate(1.5deg)">
              <img src="assets/photos/8.jpg" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover" />
              <span class="photo-caption">начало</span>
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
    const photo = this.el.querySelector('#s3-photo');

    const tl = gsap.timeline();
    tl.to(photo, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
      .add(() => {
        this.dialog.play(LINES, () => this._showNext());
      }, 1.0);
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
