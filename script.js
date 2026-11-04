document.documentElement.classList.add('js');

// Menu mobile
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('ouvert');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('ouvert'); burger.setAttribute('aria-expanded', false); } });

// Apparition au défilement
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('section.wrap>*').forEach(el => io.observe(el));

// Compteurs du hero
document.querySelectorAll('[data-n]').forEach(el => {
  const cible = +el.dataset.n; let n = 0;
  const t = setInterval(() => { el.textContent = ++n; if (n >= cible) clearInterval(t); }, 220);
});

// Réseau de neurones animé (réagit au pointeur)
const c = document.getElementById('reseau'), ctx = c.getContext('2d');
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W, H, pts = [], souris = { x: -999, y: -999 };
function init() {
  const r = devicePixelRatio || 1;
  W = c.clientWidth; H = c.clientHeight; c.width = W * r; c.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
  const n = Math.min(80, Math.floor(W * H / 14000));
  pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
}
function dessiner() {
  ctx.clearRect(0, 0, W, H);
  for (const p of pts) {
    if (!reduit) { p.x += p.vx; p.y += p.vy; }
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) { ctx.strokeStyle = `rgba(255,255,255,${.16 * (1 - d / 130)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
    }
    const dm = Math.hypot(pts[i].x - souris.x, pts[i].y - souris.y);
    if (dm < 170) { ctx.strokeStyle = `rgba(242,169,59,${.7 * (1 - dm / 170)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(souris.x, souris.y); ctx.stroke(); }
    ctx.fillStyle = dm < 170 ? '#F2A93B' : 'rgba(255,255,255,.7)';
    ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 2.2, 0, 6.3); ctx.fill();
  }
  if (!reduit) requestAnimationFrame(dessiner);
}
const hero = c.parentElement;
hero.addEventListener('pointermove', e => { const b = c.getBoundingClientRect(); souris = { x: e.clientX - b.left, y: e.clientY - b.top }; });
hero.addEventListener('pointerleave', () => souris = { x: -999, y: -999 });
addEventListener('resize', init);
init(); dessiner();
