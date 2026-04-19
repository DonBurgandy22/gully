import { Application } from '@splinetool/runtime';
import Lenis from '@studio-freight/lenis';

// 1. Lenis Smooth Scroll Engine
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Load the Spline Engine
// This overlays the user's specific 3D model into the BPCO mesh-gradient container.
const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
app.load('https://prod.spline.design/qtii53TFDDC83fRm/scene.splinecode').then(() => {
  console.log("Spline Glass Element Initialized in BPCO Grid");
});

// 3. UI Interaction: Project Card "Dice" Staggered Fading
// As the user scrolls through the BPCO layout, the glass CV cards pop into place.
const diceItems = document.querySelectorAll('.dice_item');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15 
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: Stop observing once faded in to keep it visible
      // observer.unobserve(entry.target); 
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

diceItems.forEach(item => {
  observer.observe(item);
});
