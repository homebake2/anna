const CARDS = [
  {
    img: 'assets/photos/7.jpg',
    caption: 'Калининградский зоопарк — наше место',
    rotate: '-4deg',
    top: '10%', left: '5%',
    width: '52vw',
  },
  {
    img: 'assets/photos/4.jpg',
    caption: 'она приготовила и гордится',
    rotate: '3deg',
    top: '8%', left: '42%',
    width: '50vw',
  },
  {
    img: 'assets/photos/5.jpg',
    caption: 'На фото одни цветочки, цветут и улыбаются',
    rotate: '-1.5deg',
    top: '42%', left: '18%',
    width: '55vw',
  },
];

export default class Scene6 {
  constructor(manager) {
    this.manager = manager;
    this.el = null;
    this.revealed = 0;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.style.background = 'linear-gradient(150deg, #1e1828 0%, #0d1b2a 100%)';

    el.innerHTML = `
      <div class="tap-instruction" id="s6-hint">нажмите на каждое фото</div>
      <div class="tap-cards" id="s6-cards"></div>
      <button class="btn btn-next" id="s6-next" style="opacity:0;pointer-events:none">Дальше →</button>
    `;

    this.el = el;
    const cardsEl = el.querySelector('#s6-cards');

    CARDS.forEach((card, i) => {
      const div = document.createElement('div');
      div.className = 'tap-card';
      div.style.cssText = `
        top: ${card.top};
        left: ${card.left};
        width: ${card.width};
        aspect-ratio: 3/4;
        transform: rotate(${card.rotate});
        opacity: 0;
      `;
      div.innerHTML = `
        <img src="${card.img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block" />
        <span class="tap-caption">${card.caption}</span>
      `;
      div.addEventListener('pointerup', () => this._reveal(div));
      cardsEl.appendChild(div);

      gsap.to(div, { opacity: 1, duration: 0.5, delay: 0.3 + i * 0.25, ease: 'power2.out' });
    });

    const nextBtn = el.querySelector('#s6-next');
    nextBtn.addEventListener('pointerup', () => this.manager.next());

    return el;
  }

  _reveal(card) {
    if (card.classList.contains('revealed')) {
      return;
    }
    card.classList.add('revealed');
    gsap.to(card, { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1 });
    this.revealed++;

    if (this.revealed === CARDS.length) {
      const hint = this.el.querySelector('#s6-hint');
      gsap.to(hint, { opacity: 0, duration: 0.3 });

      const btn = this.el.querySelector('#s6-next');
      btn.style.pointerEvents = 'auto';
      gsap.to(btn, { opacity: 1, duration: 0.4 });
    }
  }

  destroy() {}
}
