const CARDS = [
  {
    img: 'assets/photos/7.jpg',
    caption: 'Калининградский зоопарк — наше место',
  },
  {
    img: 'assets/photos/4.jpg',
    caption: 'Она приготовила и гордится',
  },
  {
    img: 'assets/photos/5.jpg',
    caption: 'На фото одни цветочки, цветут и улыбаются',
  },
];

function addTap(el, fn) {
  let touched = false;
  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touched = true;
    fn();
  }, { passive: false });
  el.addEventListener('click', () => {
    if (!touched) {
      fn();
    }
    touched = false;
  });
}

export default class Scene6 {
  constructor(manager) {
    this.manager = manager;
    this.el = null;
    this.cardEls = [];
    this.captionEls = [];
    this.currentCard = 0;
    this.timers = [];
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.style.background = 'linear-gradient(150deg, #1e1828 0%, #0d1b2a 100%)';

    const cardW = Math.min(260, Math.round(window.innerWidth * 0.72));
    const imgH = Math.round(cardW * 4 / 3);
    const labelH = 42;
    const padTop = 10;
    const cardTotalH = padTop + imgH + labelH;

    el.innerHTML = `
      <div style="
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: calc(var(--safe-top) + 52px);
        padding-bottom: calc(var(--safe-bottom) + 88px);
      ">
        <p class="scene-chapter" style="margin-bottom: 18px;">Глава VI · Обычные моменты</p>
        <div id="s6-stage" style="
          position: relative;
          width: ${cardW}px;
          height: ${cardTotalH}px;
          flex-shrink: 0;
        "></div>
        <p id="s6-hint" style="
          margin-top: 16px;
          font-family: var(--f-serif);
          font-style: italic;
          font-size: 0.88rem;
          color: rgba(245,240,235,0.6);
          opacity: 0;
          transition: opacity 0.4s;
        ">нажми на фото</p>
      </div>
      <button class="btn btn-next" id="s6-next" style="opacity:0;pointer-events:none">Дальше →</button>
    `;

    this.el = el;
    const stage = el.querySelector('#s6-stage');

    CARDS.forEach((card, i) => {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: ${cardW}px;
        height: ${cardTotalH}px;
        background: #fff;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        transform: rotate(${[-2, 1.5, -1][i]}deg);
        opacity: 0;
        z-index: ${i + 1};
        overflow: hidden;
      `;

      const img = document.createElement('img');
      img.src = card.img;
      img.alt = '';
      img.style.cssText = `
        display: block;
        width: ${cardW}px;
        height: ${imgH}px;
        object-fit: cover;
        margin-top: ${padTop}px;
        margin-left: ${padTop}px;
        margin-right: ${padTop}px;
        width: calc(100% - ${padTop * 2}px);
        pointer-events: none;
      `;

      const labelEl = document.createElement('div');
      labelEl.style.cssText = `
        height: ${labelH}px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        pointer-events: none;
      `;

      const caption = document.createElement('span');
      caption.textContent = card.caption;
      caption.style.cssText = `
        font-family: Georgia, serif;
        font-style: italic;
        font-size: 0.75rem;
        color: #444;
        text-align: center;
        opacity: 0;
        transition: opacity 0.4s;
      `;

      labelEl.appendChild(caption);
      div.appendChild(img);
      div.appendChild(labelEl);
      stage.appendChild(div);

      this.cardEls.push(div);
      this.captionEls.push(caption);

      addTap(div, () => this._onTap(i));
    });

    addTap(el.querySelector('#s6-next'), () => this.manager.next());

    requestAnimationFrame(() => this._start());
    return el;
  }

  _start() {
    const hint = this.el.querySelector('#s6-hint');
    gsap.to(this.cardEls[0], {
      opacity: 1,
      duration: 0.6,
      delay: 0.4,
      ease: 'power2.out',
      onComplete: () => { hint.style.opacity = '1'; },
    });
  }

  _onTap(i) {
    if (i !== this.currentCard) {
      return;
    }

    const hint = this.el.querySelector('#s6-hint');
    hint.style.opacity = '0';
    this.captionEls[i].style.opacity = '1';

    if (i === CARDS.length - 1) {
      const t = setTimeout(() => {
        const btn = this.el.querySelector('#s6-next');
        btn.style.pointerEvents = 'auto';
        gsap.to(btn, { opacity: 1, duration: 0.4 });
      }, 2500);
      this.timers.push(t);
    } else {
      const t = setTimeout(() => {
        this.currentCard = i + 1;
        gsap.to(this.cardEls[i + 1], {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => { hint.style.opacity = '1'; },
        });
      }, 3000);
      this.timers.push(t);
    }
  }

  destroy() {
    this.timers.forEach(t => clearTimeout(t));
  }
}
