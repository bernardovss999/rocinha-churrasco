/* Sabor na Brasa — estrutura compartilhada: topo, menu, rodapé, botão do Brasinha, galeria. */
const WA = 'https://wa.me/message/DRXH6UFHI6NGJ1';
const IG = 'https://www.instagram.com/sabornabrasarocinha';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
document.documentElement.classList.remove('no-js');

const ICON = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bike: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M10 9H7M15 9l-2-4h3"/>',
  plate: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/>',
  chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  flame: '<path d="M12 21c3.9 0 6.5-2.7 6.5-6.3 0-3.6-2.6-5.6-3.7-9.2-1.8 1.6-2.7 3.4-2.8 5.3-.9-.9-1.6-2-1.8-3.6C7.6 9 5.5 11.8 5.5 14.7 5.5 18.3 8.1 21 12 21z"/>',
  forks: '<path d="M4.5 19.5L14 10M12.5 8.5l3 3M12.5 8.5l3-3M15.5 11.5l3-3"/><path d="M19.5 19.5L10 10M11.5 8.5l-3 3M11.5 8.5l-3-3M8.5 11.5l-3-3"/>',
  insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>'
};
const WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm0-21.6A11.8 11.8 0 0 0 1.9 18l-1.7 6 6.2-1.6A11.8 11.8 0 1 0 12 .2z"/></svg>';
const icon = (k, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
window.SNB = { WA, ICON, WA_SVG, icon };

/* Ícones declarados no HTML: <i data-i="pin"></i> */
$$('[data-i]').forEach(el => { el.outerHTML = el.dataset.i === 'wa' ? WA_SVG : icon(el.dataset.i); });

/* ---------- Topo, menu mobile e rodapé ---------- */
const PAGES = [['index.html', 'Início'], ['cardapio.html', 'Cardápio'], ['fotos.html', 'Fotos'], ['sobre.html', 'Nossa história'], ['contato.html', 'Onde fica']];
const here = location.pathname.split('/').pop() || 'index.html';
const navLinks = PAGES.map(([h, t]) => `<a href="${h}"${h === here ? ' class="on" aria-current="page"' : ''}>${t}</a>`).join('');
const brand = `<a class="brand" href="index.html" aria-label="Sabor na Brasa — página inicial"><img src="img/logo-128.webp" width="48" height="48" alt="Logo Churrascaria Sabor na Brasa"><span><b>SABOR NA BRASA</b><small>Churrascaria · Rocinha</small></span></a>`;

document.body.insertAdjacentHTML('afterbegin', `
<header class="top" id="top"><div class="wrap">
  ${brand}
  <nav class="nav" aria-label="Principal">${navLinks}</nav>
  <a class="btn" href="pedido.html">${icon('chat')}<span>Fazer pedido</span></a>
  <button class="menuBtn" aria-label="Abrir menu" aria-expanded="false">${icon('menu')}</button>
</div></header>
<div class="drawer" id="drawer" aria-hidden="true">
  <button class="x" aria-label="Fechar menu">${icon('close')}</button>
  <nav aria-label="Menu">${navLinks}<a href="pedido.html"${here === 'pedido.html' ? ' class="on"' : ''}>Fazer pedido</a></nav>
  <a class="btn block" href="pedido.html">${icon('chat')}Pedir com o Brasinha</a>
  <a class="btn wa block" href="${WA}" target="_blank" rel="noopener">${WA_SVG}Falar no WhatsApp</a>
</div>`);

document.body.insertAdjacentHTML('beforeend', `
<footer><div class="wrap">
  <div class="foot">
    <div>${brand}<p>Churrasco feito na brasa, buffet de comida caseira e quentinha com entrega na Rocinha. Desde 2021.</p></div>
    <div><h4>Navegação</h4><nav aria-label="Rodapé">${PAGES.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="pedido.html">Fazer pedido</a></nav></div>
    <div><h4>Visite</h4><p>Estrada da Gávea, 413<br>Rocinha — Rio de Janeiro/RJ</p><p style="margin-top:12px"><a href="${IG}" target="_blank" rel="noopener">@sabornabrasarocinha</a><br><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></p></div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} Churrascaria Sabor na Brasa</span><span>Entrega na Rocinha · R$4</span></div>
</div></footer>`);

const topBar = $("#top"), drawer = $('#drawer'), menuBtn = $('.menuBtn');
const setDrawer = on => { drawer.classList.toggle('on', on); drawer.setAttribute('aria-hidden', !on); menuBtn.setAttribute('aria-expanded', on); document.body.style.overflow = on ? 'hidden' : ''; };
menuBtn.addEventListener('click', () => setDrawer(true));
$('.x', drawer).addEventListener('click', () => setDrawer(false));
const onScroll = () => topBar.classList.toggle("solid", scrollY > 20);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- Brasinha: inline (home/pedido) ou em painel (demais páginas) ---------- */
const inlineBot = $('[data-bot]');
let panel, panelBot;
function abrirPainel() {
  if (!panel) {
    document.body.insertAdjacentHTML('beforeend', `<div class="panel" role="dialog" aria-modal="true" aria-label="Pedido com o Brasinha"><div class="scrim"></div><div class="box"><button class="close" aria-label="Fechar">${icon('close')}</button><div class="bot" id="panelBot"></div></div></div>`);
    panel = $('.panel');
    const fechar = () => { panel.classList.remove('on'); document.body.style.overflow = ''; };
    $('.scrim', panel).addEventListener('click', fechar); $('.close', panel).addEventListener('click', fechar);
    addEventListener('keydown', e => e.key === 'Escape' && fechar());
    panelBot = window.Brasinha.mount($('#panelBot'));
  }
  panel.classList.add('on'); document.body.style.overflow = 'hidden';
  return panelBot;
}
function irParaBot(item) {
  if (inlineBot && inlineBot._bot) {
    inlineBot.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (item) inlineBot._bot.pedir(item);
    return;
  }
  const b = abrirPainel(); if (item) b.pedir(item);
}
window.irParaBot = irParaBot;

if (here !== 'pedido.html') {
  document.body.classList.add('hasFab');
  document.body.insertAdjacentHTML('beforeend', `<button class="fab" id="fab" aria-label="Fazer pedido com o Brasinha"><img src="img/logo-128.webp" alt=""><span><b>Pedir com o Brasinha</b><small>Monte e envie no WhatsApp</small></span><span class="badge" id="fabBadge"></span></button>`);
  const fab = $('#fab');
  fab.addEventListener('click', () => irParaBot());
  /* na home, o botão só aparece quando o bot do topo sai da tela */
  if (inlineBot) new IntersectionObserver(([e]) => fab.classList.toggle('hide', e.isIntersecting), { threshold: .25 }).observe(inlineBot);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add],[data-bot-open]'); if (!b) return;
  e.preventDefault(); irParaBot(b.dataset.add);
});

/* ---------- Revelação ao rolar ---------- */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('go'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
$$('.rv').forEach((el, i) => { if (el.dataset.d) el.style.transitionDelay = el.dataset.d + 's'; io.observe(el); });

/* ---------- Galeria com ampliação ---------- */
const figs = $$('.gallery figure');
if (figs.length) {
  document.body.insertAdjacentHTML('beforeend', `<div class="lightbox" role="dialog" aria-label="Foto ampliada"><button class="x" aria-label="Fechar">${icon('close')}</button><figure><img alt=""><figcaption></figcaption></figure></div>`);
  const lb = $('.lightbox'), img = $('img', lb);
  figs.forEach(f => f.addEventListener('click', () => {
    const src = $('img', f); img.src = src.currentSrc || src.src; img.alt = src.alt;
    $('figcaption', lb).textContent = $('figcaption', f)?.textContent || ''; lb.classList.add('on');
  }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
}

/* ---------- Cardápio: abas que acompanham a rolagem ---------- */
const mn = $('.menuNav');
if (mn) {
  const as = $$('a', mn), secs = as.map(a => $(a.getAttribute('href')));
  addEventListener('scroll', () => {
    let i = 0; secs.forEach((s, k) => { if (s.getBoundingClientRect().top < 200) i = k; });
    as.forEach((a, k) => a.classList.toggle('on', k === i));
  }, { passive: true });
}
