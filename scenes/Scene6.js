const CARDS = [
  { img: 'assets/photos/7.jpg', caption: 'Калининградский зоопарк — наше место' },
  { img: 'assets/photos/4.jpg', caption: 'Она приготовила и гордится' },
  { img: 'assets/photos/5.jpg', caption: 'На фото одни цветочки, цветут и улыбаются' },
];

export default class Scene6 {
  constructor(manager) {
    this.manager = manager;
    this.el = null;
    this.timers = [];
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.style.background = 'linear-gradient(150deg, #1e1828 0%, #0d1b2a 100%)';

    const cardW = Math.min(260, Math.round(window.innerWidth * 0.72));
    const imgH = Math.round(cardW * 4 / 3);
    const labelH = 42;
    const cardTotalH = 10 + imgH + labelH;

    el.innerHTML = `
      <div style="
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
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
      </div>
      <button class="btn btn-next" id="s6-next" style="opacity:0;pointer-events:none">Дальше →</button>
    `;

    this.el = el;
    const stage = el.querySelector('#s6-stage');

    CARDS.forEach((card, i) => {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute; top: 0; left: 0;
        width: ${cardW}px; height: ${cardTotalH}px;
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
        width: calc(100% - 20px);
        height: ${imgH}px;
        object-fit: cover;
        margin: 10px 10px 0;
        pointer-events: none;
      `;

      const labelEl = document.createElement('div');
      labelEl.style.cssText = `
        height: ${labelH}px;
        display: flex; align-items: center; justify-content: center;
        padding: 0 8px; pointer-events: none;
      `;

      const caption = document.createElement('span');
      caption.textContent = card.caption;
      caption.dataset.captionIndex = i;
      caption.style.cssText = `
        font-family: Georgia, serif;
        font-style: italic; font-size: 0.75rem;
        color: #444; text-align: center;
        opacity: 0; transition: opacity 0.5s;
      `;

      labelEl.appendChild(caption);
      div.appendChild(img);
      div.appendChild(labelEl);
      stage.appendChild(div);
    });

    const btn = el.querySelector('#s6-next');
    btn.addEventListener('pointerup', () => this.manager.next());

    requestAnimationFrame(() => this._runSequence(stage));
    return el;
  }

  _runSequence(stage) {
    const cards = stage.querySelectorAll(':scope > div');
    let delay = 0.5;

    CARDS.forEach((_, i) => {
      const card = cards[i];
      const caption = card.querySelector('span');

      // Показать карточку
      const t1 = setTimeout(() => {
        gsap.to(card, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      }, delay * 1000);
      this.timers.push(t1);

      // Через 0.5с после появления — показать текст
      const t2 = setTimeout(() => {
        caption.style.opacity = '1';
      }, (delay + 0.5) * 1000);
      this.timers.push(t2);

      if (i < CARDS.length - 1) {
        // Через 3с после текста — следующая карточка
        delay = delay + 0.5 + 3;
      } else {
        // Последняя карточка — через 3с кнопка
        const t3 = setTimeout(() => {
          const btn = this.el.querySelector('#s6-next');
          btn.style.pointerEvents = 'auto';
          gsap.to(btn, { opacity: 1, duration: 0.4 });
        }, (delay + 0.5 + 3) * 1000);
        this.timers.push(t3);
      }
    });
  }

  destroy() {
    this.timers.forEach(t => clearTimeout(t));
  }
}
