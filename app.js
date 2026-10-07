/* Sabor na Brasa — interações e animações compartilhadas */
const WA = 'https://wa.me/message/DRXH6UFHI6NGJ1';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const page = document.body.dataset.page;

const ICON = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  fire: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8 0 4 3 7 7 7z"/>',
  photo: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  arrow: '<path d="M7 17L17 7M9 7h8v8"/>'
};
const svg = (k, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;

/* ---------- Topo + tab bar ---------- */
const links = [
  ['index.html', 'Início', 'home'], ['cardapio.html', 'Cardápio', 'menu'],
  ['pedido.html', 'Pedir', 'fire'], ['fotos.html', 'Fotos', 'photo'], ['contato.html', 'Onde fica', 'pin']
];
document.body.insertAdjacentHTML('afterbegin', `
<header class="top" id="top">
  <a class="brand" href="index.html" aria-label="Sabor na Brasa — início"><img src="img/logo.jpg" alt="Logo Churrascaria Sabor na Brasa"><span><b>SABOR NA BRASA</b><small>ROCINHA • RJ</small></span></a>
  <nav class="deskNav" aria-label="Principal">
    <a href="index.html">Início</a><a href="cardapio.html">Cardápio</a><a href="fotos.html">Fotos</a><a href="sobre.html">Nossa história</a><a href="contato.html">Onde fica</a>
  </nav>
  <a class="pill" href="pedido.html">🔥 Pedir</a>
</header>
<nav class="tabbar" aria-label="Menu do app"><span class="blob"></span>
  ${links.map(([h, t, i]) => i === 'fire'
    ? `<a class="order" href="${h}"><span class="b">${svg(i)}</span>${t}</a>`
    : `<a href="${h}">${svg(i)}${t}</a>`).join('')}
</nav>
<div class="curtain" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
<div class="toast" id="toast"></div>`);

const here = location.pathname.split('/').pop() || 'index.html';
$$('.deskNav a, .tabbar a').forEach(a => { if (a.getAttribute('href') === here) a.classList.add('on'); });
const tabs = $$('.tabbar a'), onIdx = tabs.findIndex(a => a.classList.contains('on'));
const blob = $('.tabbar .blob');
if (onIdx >= 0 && onIdx !== 2) blob.style.transform = `translateX(calc(${onIdx * 100}% + ${onIdx * 12}px))`; else blob.style.opacity = 0;

/* esconde topo ao descer, mostra ao subir */
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY, top = $('#top');
  top.classList.toggle('solid', y > 30);
  top.classList.toggle('hide', y > lastY && y > 300);
  lastY = y;
}, { passive: true });

/* ---------- Toast ---------- */
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2600); }
window.toast = toast;

/* ---------- Preloader (só na 1ª visita da sessão) ---------- */
const loader = $('.loader');
let seen = false; try { seen = sessionStorage.getItem('snb-seen'); sessionStorage.setItem('snb-seen', 1); } catch (e) {}
function start() { document.documentElement.classList.add('ready'); runIntro(); }
if (loader && !seen && !RM) {
  const c = $('.count', loader); let n = 0;
  const iv = setInterval(() => { n = Math.min(100, n + Math.ceil(Math.random() * 9)); c.textContent = String(n).padStart(3, '0'); if (n >= 100) { clearInterval(iv); loader.classList.add('out'); setTimeout(() => { loader.remove(); start(); }, 700); } }, 45);
} else { loader && loader.remove(); requestAnimationFrame(start); }

/* ---------- Transição entre páginas ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  const h = a.getAttribute('href');
  if (!h || h.startsWith('#') || a.target === '_blank' || /^(https?:|mailto:|tel:)/.test(h) || e.metaKey || e.ctrlKey) return;
  e.preventDefault(); navigator.vibrate?.(8);
  $('.curtain').classList.add('in');
  setTimeout(() => location.href = h, RM ? 0 : 520);
});
addEventListener('pageshow', e => { if (e.persisted) $('.curtain').classList.remove('in'); });

/* ---------- Split text ---------- */
$$('.split').forEach(el => {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { frag.append(word); return; }
        const w = document.createElement('span'); w.className = 'w';
        [...word].forEach(ch => { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; w.append(c); });
        frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el);
  $$('.c', el).forEach((c, i) => c.style.transitionDelay = (i * 0.028) + 's');
});

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('go'); io.unobserve(en.target);
  if (en.target.dataset.count) countUp(en.target);
}), { threshold: .18, rootMargin: '0px 0px -40px 0px' });
function runIntro() { $$('.rv, .rv-img, .split:not(.hero .split), .brushline, [data-count], .masonry figure').forEach(el => io.observe(el)); $$('.hero .split, .phead .split').forEach((el, i) => setTimeout(() => el.classList.add('go'), 120 + i * 260)); }
$$('[data-delay]').forEach(el => el.style.transitionDelay = el.dataset.delay + 's');

function countUp(el) {
  const end = +el.dataset.count, dur = 1400, t0 = performance.now();
  const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(end * e); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ---------- Ripple + vibração em botões ---------- */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn, .pill, .quick button, .tabs button'); if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
  sp.className = 'ripple'; sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.style.position ||= 'relative'; b.style.overflow = 'hidden'; b.append(sp); setTimeout(() => sp.remove(), 700);
});

/* ---------- Brasas (partículas) no hero ---------- */
const cv = $('#embers');
if (cv && !RM) {
  const ctx = cv.getContext('2d'); let W, H, tilt = 0, ps = [];
  const fit = () => { const d = Math.min(devicePixelRatio, 2); W = cv.width = cv.offsetWidth * d; H = cv.height = cv.offsetHeight * d; };
  fit(); addEventListener('resize', fit);
  const spawn = (x, y, burst) => ({ x: x ?? Math.random() * W, y: y ?? H + 10, r: Math.random() * 2.4 + .6, vy: -(Math.random() * 1.6 + .5) * (burst ? 2.4 : 1), vx: (Math.random() - .5) * (burst ? 4 : .6), life: 1, hue: 20 + Math.random() * 25 });
  for (let i = 0; i < 70; i++) { const p = spawn(); p.y = Math.random() * H; ps.push(p); }
  addEventListener('deviceorientation', e => { tilt = (e.gamma || 0) / 30; });
  cv.parentElement.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(), d = W / r.width; for (let i = 0; i < 26; i++) ps.push(spawn((e.clientX - r.left) * d, (e.clientY - r.top) * d, true)); });
  (function loop() {
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    ps.forEach(p => {
      p.x += p.vx + Math.sin(p.y / 40) * .4 + tilt; p.y += p.vy; p.life -= .0035; p.vx *= .99;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue},100%,65%,${p.life})`); g.addColorStop(1, 'hsla(20,100%,50%,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 7); ctx.fill();
    });
    ps = ps.filter(p => p.life > 0 && p.y > -20); while (ps.length < 70) ps.push(spawn());
    requestAnimationFrame(loop);
  })();
}

/* ---------- Tilt 3D + brilho nos portais ---------- */
$$('[data-tilt]').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg)`;
    el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

/* ---------- Pilha de cartas (swipe) ---------- */
$$('.deck').forEach(deck => {
  const cards = $$('.card', deck);
  const lay = () => cards.forEach((c, i) => { const k = (i - deck._i + cards.length) % cards.length; c.style.zIndex = cards.length - k; c.style.transform = `translateY(${k * 14}px) scale(${1 - k * .05}) rotate(${k ? (k % 2 ? 3 : -3) : 0}deg)`; c.style.opacity = k > 3 ? 0 : 1; });
  deck._i = 0; lay();
  let sx = 0, dx = 0, drag = null;
  deck.addEventListener('pointerdown', e => { drag = cards[deck._i]; sx = e.clientX; dx = 0; drag.style.transition = 'none'; drag.setPointerCapture(e.pointerId); });
  deck.addEventListener('pointermove', e => { if (!drag) return; dx = e.clientX - sx; drag.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`; });
  const end = () => {
    if (!drag) return; drag.style.transition = '';
    if (Math.abs(dx) > 70) { drag.style.transform = `translateX(${dx > 0 ? 600 : -600}px) rotate(${dx / 6}deg)`; navigator.vibrate?.(12); setTimeout(() => { deck._i = (deck._i + 1) % cards.length; lay(); }, 260); }
    else if (Math.abs(dx) < 5) { deck._i = (deck._i + 1) % cards.length; lay(); }
    else lay();
    drag = null;
  };
  deck.addEventListener('pointerup', end); deck.addEventListener('pointercancel', end);
});

/* ---------- Lightbox ---------- */
const lb = $('.lightbox');
if (lb) {
  $$('.masonry figure').forEach(f => f.addEventListener('click', () => { $('img', lb).src = $('img', f).src; $('p', lb).textContent = f.dataset.cap || $('figcaption', f)?.textContent || ''; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
}

/* ---------- Linha do tempo enchendo ---------- */
const tl = $('.timeline');
if (tl) addEventListener('scroll', () => { const r = tl.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height)); tl.style.setProperty('--p', p * 100 + '%'); }, { passive: true });

/* ---------- Abas do cardápio ---------- */
const mt = $('.tabs');
if (mt) {
  const bs = $$('button', mt);
  bs.forEach(b => b.addEventListener('click', () => { const t = $(b.dataset.go); scrollTo({ top: t.offsetTop - 130, behavior: 'smooth' }); }));
  addEventListener('scroll', () => { let cur = bs[0]; bs.forEach(b => { if ($(b.dataset.go).getBoundingClientRect().top < 200) cur = b; }); bs.forEach(b => b.classList.toggle('on', b === cur)); }, { passive: true });
}
/* "Pedir esse" → leva para o agente com o item */
$$('[data-add]').forEach(b => b.addEventListener('click', () => { location.href = 'pedido.html?item=' + encodeURIComponent(b.dataset.add); }));

/* ---------- GSAP: parallax do hero + carrossel horizontal preso ---------- */
function withGsap() {
  if (!window.gsap || !window.ScrollTrigger || RM) { $$('.hscroll').forEach(h => h.classList.add('native')); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) { const l = new Lenis({ lerp: .1 }); l.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  $$('.hero .bg, .phead .bgword').forEach(el => gsap.to(el, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: el.closest('header,section,.hero,.phead'), start: 'top top', end: 'bottom top', scrub: true } }));
  $$('.hero h1').forEach(el => gsap.to(el, { scale: .86, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
  $$('.hscroll').forEach(h => {
    const tr = $('.htrack', h);
    gsap.to(tr, { x: () => -(tr.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: h, start: 'center center', end: () => '+=' + tr.scrollWidth, pin: true, scrub: .6, invalidateOnRefresh: true } });
    $$('.hcard img', h).forEach(img => gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: h, start: 'center center', end: () => '+=' + tr.scrollWidth, scrub: true } }));
  });
  $$('.portal img').forEach(img => gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } }));
  $$('.marquee').forEach(m => gsap.fromTo(m, { xPercent: m.classList.contains('alt') ? 6 : -6 }, { xPercent: m.classList.contains('alt') ? -6 : 6, ease: 'none', scrollTrigger: { trigger: m, scrub: true } }));
}
addEventListener('load', withGsap);
