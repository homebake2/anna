export default class SceneManager {
  constructor(app) {
    this.app = app;
    this.scenes = [];
    this.currentIndex = -1;
    this.transitioning = false;
  }

  register(scenes) {
    this.scenes = scenes;
  }

  start() {
    this._loadScene(0);
  }

  next() {
    if (this.transitioning) {
      return;
    }
    const nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.scenes.length) {
      return;
    }
    this._transition(nextIndex);
  }

  goTo(index) {
    if (this.transitioning) {
      return;
    }
    this._transition(index);
  }

  _loadScene(index) {
    const SceneClass = this.scenes[index];
    const instance = new SceneClass(this);
    const el = instance.mount();
    this.app.appendChild(el);
    this.currentInstance = instance;
    this.currentEl = el;
    this.currentIndex = index;

    gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
  }

  _transition(nextIndex) {
    this.transitioning = true;
    const outEl = this.currentEl;
    const outInstance = this.currentInstance;

    gsap.to(outEl, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (outInstance && typeof outInstance.destroy === 'function') {
          outInstance.destroy();
        }
        if (outEl && outEl.parentNode) {
          outEl.parentNode.removeChild(outEl);
        }
        this._loadScene(nextIndex);
        this.transitioning = false;
      },
    });
  }
}
