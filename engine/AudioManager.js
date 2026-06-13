const AudioManager = (() => {
  let howl = null;
  let muted = false;
  let started = false;

  function init(src) {
    howl = new Howl({
      src: [src],
      loop: true,
      volume: 0,
      html5: true,
      onloaderror: (id, err) => console.warn('Audio load error:', err),
      onplayerror: (id, err) => {
        console.warn('Audio play error:', err);
        // На iOS иногда нужно разблокировать контекст вручную
        howl.once('unlock', () => {
          howl.play();
        });
      },
    });
  }

  function start() {
    if (started || !howl) {
      return;
    }
    started = true;

    // fade нужно вызывать только после того как звук реально начал играть
    howl.once('play', () => {
      howl.fade(0, 0.45, 2500);
    });
    howl.play();

    const btn = document.getElementById('mute-btn');
    if (btn) {
      btn.classList.add('visible');
    }
  }

  function pause() {
    if (howl && howl.playing()) {
      howl.fade(howl.volume(), 0, 600);
      setTimeout(() => { howl.pause(); }, 620);
    }
  }

  function resume() {
    if (!howl || howl.playing()) {
      return;
    }
    howl.once('play', () => {
      howl.fade(0, 0.45, 1200);
    });
    howl.play();
  }

  function toggleMute() {
    muted = !muted;
    if (howl) {
      howl.mute(muted);
    }
    const iconSound = document.getElementById('icon-sound');
    const iconMute = document.getElementById('icon-mute');
    if (iconSound && iconMute) {
      iconSound.style.display = muted ? 'none' : '';
      iconMute.style.display = muted ? '' : 'none';
    }
  }

  return { init, start, pause, resume, toggleMute };
})();

export default AudioManager;
