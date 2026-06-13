import DialogSystem from '../engine/DialogSystem.js';

const LINES = [
  { text: 'До того как всё началось — было «до».' },
  { text: 'Она — живая, смешная, с анекдотом наготове.' },
  { text: 'Он — уверен в себе, собирается на ролевую игру. Спойлер: выглядит так себе.' },
  { text: 'Два человека, которые ещё не знали, куда их это приведет.' },
];

export default class Scene1 {
  constructor(manager) {
    this.manager = manager;
    this.dialog = null;
    this.el = null;
    this.dialogStarted = false;
  }

  mount() {
    const el = document.createElement('div');
    el.className = 'scene';
    el.style.background = 'linear-gradient(160deg, #1a2535 0%, #0d1b2a 100%)';
    el.innerHTML = `
      <div class="scene-content">
        <p class="scene-chapter">Глава I · До того как</p>
        <div style="padding: 16px 20px 0; display: flex; flex-direction: column; gap: 16px;">
          <div class="video-wrapper" id="s1-video-wrap" style="opacity:0;position:relative;cursor:pointer">
            <video
              id="s1-video"
              src="assets/videos/1.mp4"
              playsinline
              preload="auto"
              style="width:100%;display:block;max-height:45svh;object-fit:cover;border-radius:12px"
            ></video>
            <div id="s1-tap-hint" style="
              position:absolute;inset:0;
              display:flex;flex-direction:column;align-items:center;justify-content:center;
              background:rgba(13,27,42,0.5);
              border-radius:12px;
              gap:10px;
            ">
              <div style="width:52px;height:52px;border-radius:50%;background:rgba(232,201,122,0.15);border:1.5px solid rgba(232,201,122,0.6);display:flex;align-items:center;justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="5,3 19,12 5,21" fill="#e8c97a"/></svg>
              </div>
              <span style="font-family:var(--f-serif);font-style:italic;font-size:0.9rem;color:rgba(232,201,122,0.9);">нажми, чтобы посмотреть</span>
            </div>
          </div>
          <div class="slide-photos" id="s1-photos" style="opacity:0;padding:0">
            <div class="slide-photo-item">
              <img src="assets/photos/9.jpg" alt="" style="border-radius:8px;aspect-ratio:3/4;object-fit:cover" />
              <span class="slide-photo-label">она, тогда</span>
            </div>
            <div class="slide-photo-item">
              <img src="assets/photos/11.jpg" alt="" style="border-radius:8px;aspect-ratio:3/4;object-fit:cover" />
              <span class="slide-photo-label">он, «готов»</span>
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
    const videoWrap = this.el.querySelector('#s1-video-wrap');
    const video = this.el.querySelector('#s1-video');
    const tapHint = this.el.querySelector('#s1-tap-hint');
    const photos = this.el.querySelector('#s1-photos');

    // Видео стоит на паузе, без звука
    video.muted = true;
    video.pause();

    // Показать видео-блок
    gsap.to(videoWrap, { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.3 });

    // Тап по видео — запускаем
    videoWrap.addEventListener('pointerup', () => {
      if (!video.paused) {
        return;
      }

      gsap.to(tapHint, { opacity: 0, duration: 0.25, onComplete: () => { tapHint.style.display = 'none'; } });

      video.muted = false;
      window.__audioManager.pause();
      video.play().catch(() => {});
    });

    // После первого видео — ставим второе
    video.addEventListener('ended', () => {
      video.src = 'assets/videos/2.mp4';
      video.load();
      video.muted = false;
      video.play().catch(() => {});

      video.addEventListener('ended', () => {
        this._afterVideos(videoWrap, photos);
      }, { once: true });
    }, { once: true });

    // Фото появляются сразу
    gsap.to(photos, { opacity: 1, duration: 0.6, delay: 0.9, ease: 'power2.out' });
  }

  _afterVideos(videoWrap, photos) {
    window.__audioManager.resume();

    gsap.to(videoWrap, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => { videoWrap.style.display = 'none'; },
    });

    gsap.to(photos, { opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' });
    setTimeout(() => { this._startDialog(); }, 900);
  }

  _startDialog() {
    if (this.dialogStarted) {
      return;
    }
    this.dialogStarted = true;
    this.dialog.play(LINES, () => this._showNext());
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
