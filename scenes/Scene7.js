export default class Scene7 {
  constructor(manager) {
    this.manager = manager;
    this.el = null;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.innerHTML = `
      <div class="fullscreen-photo" id="s7-bg" style="background-image:url('assets/photos/1.jpg')"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,42,0.85) 0%,rgba(13,27,42,0.3) 60%,transparent 100%)"></div>
      <div class="fullscreen-text" style="justify-content:flex-end;padding-bottom:calc(var(--safe-bottom) + 120px)">
        <p id="s7-l1" style="font-family:var(--f-serif);font-style:italic;font-size:clamp(0.9rem,3.8vw,1.1rem);color:var(--c-white-dim)">Я тебя люблю.</p>
        <p id="s7-l2" style="font-family:var(--f-serif);font-size:clamp(1.6rem,7vw,2rem);font-weight:600;color:var(--c-white)">❤️</p>
        <p id="s7-l3" style="font-family:var(--f-serif);font-style:italic;font-size:clamp(1rem,4.2vw,1.25rem);color:var(--c-gold)">Всё что было до — привело сюда.</p>
        <p id="s7-l4" style="font-family:var(--f-serif);font-size:clamp(1rem,4vw,1.15rem);color:var(--c-white-dim)">Сюда — это к тебе. К нам.</p>
      </div>
      <button class="btn btn-next" id="s7-next" style="opacity:0">К финалу ♥</button>
    `;

    this.el = el;

    const next = el.querySelector('#s7-next');
    next.addEventListener('pointerup', () => this.manager.next());

    requestAnimationFrame(() => this._animate());
    return el;
  }

  _animate() {
    const bg = this.el.querySelector('#s7-bg');
    const l1 = this.el.querySelector('#s7-l1');
    const l2 = this.el.querySelector('#s7-l2');
    const l3 = this.el.querySelector('#s7-l3');
    const l4 = this.el.querySelector('#s7-l4');
    const next = this.el.querySelector('#s7-next');

    setTimeout(() => {
      bg.classList.add('sharp');
    }, 400);

    const tl = gsap.timeline();
    tl.to(l1, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.6)
      .to(l2, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1.4)
      .to(l3, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 2.2)
      .to(l4, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 3.0)
      .to(next, { opacity: 1, duration: 0.5 }, 4.2);
  }

  destroy() {}
}
