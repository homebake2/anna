export default class DialogSystem {
  constructor(container) {
    this.container = container;
    this.lines = [];
    this.index = 0;
    this.typing = false;
    this.interval = null;
    this.onComplete = null;

    this.box = document.createElement('div');
    this.box.className = 'dialog-box';
    this.box.innerHTML = `
      <p class="dialog-text"></p>
      <span class="dialog-hint">нажмите, чтобы продолжить</span>
    `;
    this.textEl = this.box.querySelector('.dialog-text');
    this.hintEl = this.box.querySelector('.dialog-hint');

    this.box.addEventListener('pointerup', () => this._handleTap());
    container.appendChild(this.box);
  }

  play(lines, onComplete) {
    this.lines = lines;
    this.index = 0;
    this.onComplete = onComplete;

    gsap.to(this.box, { opacity: 1, duration: 0.4 });
    this._showLine(0);
  }

  _showLine(idx) {
    const line = this.lines[idx];
    if (!line) {
      return;
    }
    this.typing = true;
    this.hintEl.style.opacity = '0';
    this.textEl.textContent = '';

    const chars = [...line.text];
    let i = 0;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (i < chars.length) {
        this.textEl.textContent += chars[i];
        i++;
      } else {
        clearInterval(this.interval);
        this.typing = false;
        const isLast = idx === this.lines.length - 1;
        this.hintEl.style.opacity = isLast ? '0' : '0.6';
        if (isLast && this.onComplete) {
          setTimeout(() => this.onComplete(), 400);
        }
      }
    }, 35);
  }

  _handleTap() {
    if (this.typing) {
      clearInterval(this.interval);
      this.typing = false;
      const line = this.lines[this.index];
      if (line) {
        this.textEl.textContent = line.text;
      }
      const isLast = this.index === this.lines.length - 1;
      this.hintEl.style.opacity = isLast ? '0' : '0.6';
      if (isLast && this.onComplete) {
        setTimeout(() => this.onComplete(), 400);
      }
      return;
    }

    if (this.index < this.lines.length - 1) {
      this.index++;
      this._showLine(this.index);
    }
  }

  destroy() {
    clearInterval(this.interval);
    if (this.box.parentNode) {
      this.box.parentNode.removeChild(this.box);
    }
  }
}
