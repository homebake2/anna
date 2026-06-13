import SceneManager from './engine/SceneManager.js';
import AudioManager from './engine/AudioManager.js';

import Intro from './scenes/Intro.js';
import Scene1 from './scenes/Scene1.js';
import Scene2 from './scenes/Scene2.js';
import Scene3 from './scenes/Scene3.js';
import Scene4 from './scenes/Scene4.js';
import Scene5 from './scenes/Scene5.js';
import Scene6 from './scenes/Scene6.js';
import Scene7 from './scenes/Scene7.js';
import Finale from './scenes/Finale.js';

const SCENES = [Intro, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Finale];

const preloader = document.getElementById('preloader');
const app = document.getElementById('app');
const muteBtn = document.getElementById('mute-btn');

AudioManager.init('assets/music/music.mp3');
muteBtn.addEventListener('pointerup', () => AudioManager.toggleMute());

const manager = new SceneManager(app);
manager.register(SCENES);

window.__sceneManager = manager;
window.__audioManager = AudioManager;

const photoSrcs = [
  'assets/photos/1.jpg',
  'assets/photos/2.jpg',
  'assets/photos/3.jpg',
  'assets/photos/4.jpg',
  'assets/photos/5.jpg',
  'assets/photos/6.jpg',
  'assets/photos/7.jpg',
  'assets/photos/8.jpg',
  'assets/photos/9.jpg',
  'assets/photos/10.jpg',
  'assets/photos/11.jpg',
];

function loadImages(srcs) {
  return Promise.allSettled(
    srcs.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    }))
  );
}

loadImages(photoSrcs).then(() => {
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      preloader.style.display = 'none';
      manager.start();
    },
  });
});
