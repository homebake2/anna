import DialogSystem from '../engine/DialogSystem.js';

const LINES = [
  { text: 'Байкал зимой.' },
  { text: 'Замёрзшие волны у острова. Лёд, который выглядит как застывшее время.' },
  { text: 'Стоишь на этом льду и понимаешь: что-то большое происходит.' },
  { text: 'Не с Байкалом. С нами.' },
];

export default class Scene5 {
  constructor(manager) {
    this.manager = manager;
    this.dialog = null;
    this.el = null;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.innerHTML = `
      <div class="scene-bg" id="s5-bg" style="
        background-image: url('assets/photos/3.jpg');
        filter: blur(3px) brightness(0.45);
        transform: scale(1.06);
        transition: filter 2s ease, transform 2s ease;
      "></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(13,27,42,0.7) 0%, transparent 50%)"></div>
      <div class="fullscreen-text">
        <p id="s5-line1" style="font-size:clamp(0.85rem,3.5vw,1rem)">Байкал. Зима.</p>
        <p id="s5-line2">Замёрзшие волны.</p>
        <p id="s5-line3" style="color:var(--c-gold)">Мы.</p>
      </div>
    `;

    this.el = el;
    this.dialog = new DialogSystem(el);

    requestAnimationFrame(() => this._animate());
    return el;
  }

  _animate() {
    const bg = this.el.querySelector('#s5-bg');
    const l1 = this.el.querySelector('#s5-line1');
    const l2 = this.el.querySelector('#s5-line2');
    const l3 = this.el.querySelector('#s5-line3');

    setTimeout(() => {
      bg.style.filter = 'blur(0px) brightness(0.45)';
      bg.style.transform = 'scale(1)';
    }, 300);

    const tl = gsap.timeline();
    tl.to(l1, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
      .to(l2, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.2)
      .to(l3, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 2.0)
      .add(() => {
        this.dialog.play(LINES, () => this._showNext());
      }, 3.0);
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
