/* ==========================================================================
   HABITLY — Web Audio API Sound Effects & Confetti Engine
   ========================================================================== */

const HabitlyAudio = (() => {
  let audioCtx = null;
  let soundEnabled = true;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', vol = 0.12) {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* silently fail */ }
  }

  return {
    toggle() { soundEnabled = !soundEnabled; return soundEnabled; },
    isEnabled() { return soundEnabled; },
    playComplete() { playTone(880, 0.12, 'sine', 0.1); setTimeout(() => playTone(1320, 0.15, 'sine', 0.08), 100); },
    playIncrement() { playTone(660, 0.08, 'triangle', 0.08); },
    playClick() { playTone(440, 0.05, 'square', 0.04); },
    playSuccess() { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.15), 200); },
    playLevelUp() { playTone(523, 0.12); setTimeout(() => playTone(659, 0.12), 150); setTimeout(() => playTone(784, 0.12), 300); setTimeout(() => playTone(1047, 0.2), 450); },
    playError() { playTone(200, 0.2, 'sawtooth', 0.06); },
  };
})();

/* Confetti Engine */
const Confetti = (() => {
  let canvas, ctx;
  let particles = [];
  let animId = null;

  function init() {
    canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function burst(count = 60) {
    if (!ctx) init();
    const colors = ['#d4ff00', '#7c3aed', '#a855f7', '#22c55e', '#f59e0b', '#ffffff'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -14 - 4,
        w: Math.random() * 8 + 4,
        h: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1,
      });
    }
    if (!animId) animate();
  }

  function animate() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.vy += 0.3;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= 0.012;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0) {
      animId = requestAnimationFrame(animate);
    } else {
      animId = null;
    }
  }

  return { init, burst };
})();

document.addEventListener('DOMContentLoaded', () => Confetti.init());
