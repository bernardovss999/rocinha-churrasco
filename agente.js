/* Brasinha — atendente de pedidos do Sabor na Brasa.
   Conversa por regras simples (sem servidor). O pedido montado vai pronto para o WhatsApp.
   WA_NUMERO: preencha com o número da casa (só dígitos, com 55 + DDD) para o pedido
   já chegar escrito na conversa. Vazio = copia o pedido e abre o link do WhatsApp. */
(() => {
const WA_NUMERO = '';
const WA_LINK = 'https://wa.me/message/DRXH6UFHI6NGJ1';
const ENTREGA = 4;
const MENU = {
  'Comida do buffet': { p: 33, img: 'buffet' },
  'Buffet + churrasco misto': { p: 40, img: 'quentinha' },
  'Quentinha completa': { p: 40, img: 'tudo' },
  'Fraldinha': { p: null, img: 'nivela' }, 'Picanha': { p: null, img: 'top' },
  'Coração de frango': { p: null, img: 'cortes' }, 'Espetinhos': { p: null, img: 'aovivo' },
  'Batata frita': { p: null }, 'Salada de maionese': { p: null }, 'Farofa da casa': { p: null }
};
const PRINCIPAIS = [
  ['Buffet + churrasco · R$40', 'add:Buffet + churrasco misto', 'main'],
  ['Buffet · R$33', 'add:Comida do buffet'],
  ['Quentinha completa · R$40', 'add:Quentinha completa'],
  ['Carnes na brasa', 'carnes'], ['Entrega e endereço', 'info']
];
const MAIS = [['Fechar pedido', 'fechar', 'main'], ['Carnes na brasa', 'carnes'], ['Acompanhamentos', 'acomp'], ['Ver cardápio', 'inicio']];
const KEY = 'snb-brasinha';
const brl = v => 'R$ ' + v.toFixed(2).replace('.', ',');
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const img = n => n ? `img/${n}-640.webp` : null;
const { icon, WA_SVG } = window.SNB;

let S = load();
function novo() { return { cart: {}, modo: null, etapa: null, nome: '', endereco: '', passo: 1, log: [] }; }
function load() { try { return JSON.parse(sessionStorage.getItem(KEY)) || novo(); } catch (e) { return novo(); } }
function save() { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

const instancias = [];

function mount(root) {
  root.classList.add('bot');
  root.innerHTML = `
    <div class="botHead"><img src="img/logo-128.webp" alt=""><div><b>Brasinha</b><small>Atendente da casa · online</small></div><button class="reset" type="button">Recomeçar</button></div>
    <div class="botSteps" aria-hidden="true"><span><b>1</b>Escolha</span><span><b>2</b>Confira</span><span><b>3</b>WhatsApp</span></div>
    <div class="botMsgs" aria-live="polite"></div>
    <div class="botQuick"></div>
    <div class="botCart"><span></span><button type="button">${WA_SVG}Enviar</button></div>
    <form class="botForm"><input placeholder="Escreva aqui. Ex.: 2 quentinhas" autocomplete="off" aria-label="Mensagem para o Brasinha" enterkeyhint="send"><button aria-label="Enviar mensagem">${icon('send')}</button></form>`;
  const q = s => root.querySelector(s);
  const ui = { root, msgs: q('.botMsgs'), quick: q('.botQuick'), cart: q('.botCart'), input: q('input') };
  const api = { ui, pedir: item => acao('add:' + item, item) };
  root._bot = api; instancias.push(api);

  q('.botForm').addEventListener('submit', e => { e.preventDefault(); const t = ui.input.value.trim(); if (t) { ui.input.value = ''; ouvir(t); } });
  q('.botCart button').addEventListener('click', enviar);
  q('.reset').addEventListener('click', () => { S = novo(); save(); instancias.forEach(i => (i.ui.msgs.innerHTML = '')); saudacao(); });

  if (S.log.length) { S.log.forEach(m => render(api, m, false)); chips(S.ultimas || PRINCIPAIS); barra(); }
  else saudacao();
  return api;
}

/* ---------- Render ---------- */
function render(api, m, anim = true) {
  const d = document.createElement('div'); d.className = 'msg ' + (m.w === 'bot' ? 'them' : 'me'); d.textContent = m.t;
  if (!anim) d.style.animation = 'none';
  if (m.sum) d.insertAdjacentHTML('beforeend', resumoHTML());
  if (m.img) { const i = new Image(); i.src = img(m.img); i.alt = ''; i.loading = 'lazy'; d.append(i); }
  api.ui.msgs.append(d); api.ui.msgs.scrollTop = api.ui.msgs.scrollHeight;
}
function eu(t) { const m = { w: 'me', t }; S.log.push(m); save(); instancias.forEach(i => render(i, m)); }
function bot(t, opts = [], extra = {}) {
  instancias.forEach(i => { i.ui.quick.innerHTML = ''; });
  const tipo = instancias.map(i => { const d = document.createElement('div'); d.className = 'msg them'; d.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; i.ui.msgs.append(d); i.ui.msgs.scrollTop = i.ui.msgs.scrollHeight; return d; });
  const m = { w: 'bot', t, ...extra };
  S.log.push(m); S.ultimas = opts; save();
  setTimeout(() => { tipo.forEach(d => d.remove()); instancias.forEach(i => render(i, m)); chips(opts); barra(); }, 380 + Math.min(700, t.length * 6));
}
function chips(opts) {
  instancias.forEach(api => {
    api.ui.quick.innerHTML = '';
    opts.forEach(([label, act, cls], k) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = cls || '';
      b.innerHTML = cls === 'wa' ? WA_SVG + label : label; b.style.animationDelay = k * .04 + 's';
      b.addEventListener('click', () => acao(act, label)); api.ui.quick.append(b);
    });
    api.ui.quick.scrollLeft = 0;
    api.ui.input.placeholder = S.etapa === 'nome' ? 'Digite seu nome' : S.etapa === 'endereco' ? 'Rua, número e ponto de referência' : 'Escreva aqui. Ex.: 2 quentinhas';
    api.ui.root.querySelectorAll('.botSteps span').forEach((s, k) => s.classList.toggle('on', k < S.passo));
  });
  const badge = document.getElementById('fabBadge'), n = itens();
  if (badge) { badge.textContent = n; badge.classList.toggle('on', n > 0); }
}

/* ---------- Pedido ---------- */
const itens = () => Object.values(S.cart).reduce((a, b) => a + b, 0);
function total() { let t = 0, consulta = false; for (const [k, q] of Object.entries(S.cart)) { const p = MENU[k]?.p; if (p == null) consulta = true; else t += p * q; } if (S.modo === 'entrega') t += ENTREGA; return { t, consulta }; }
function barra() {
  const n = itens(), { t, consulta } = total();
  instancias.forEach(i => {
    i.ui.cart.classList.toggle('on', n > 0 && S.passo < 3);
    i.ui.cart.querySelector('span').innerHTML = `${n} ${n > 1 ? 'itens' : 'item'} · <b>${brl(t)}</b><small>${consulta ? 'Itens da brasa: valor confirmado no WhatsApp' : 'Toque em Enviar quando terminar'}</small>`;
  });
}
function add(item, q = 1) { S.cart[item] = (S.cart[item] || 0) + q; save(); }
function resumoHTML() {
  const { t, consulta } = total();
  const li = Object.entries(S.cart).map(([k, q]) => `<li><span>${q}x ${k}</span><span>${MENU[k]?.p ? brl(MENU[k].p * q) : 'a consultar'}</span></li>`).join('');
  return `<ul class="sum">${li}${S.modo === 'entrega' ? `<li><span>Entrega na Rocinha</span><span>${brl(ENTREGA)}</span></li>` : '<li><span>Retirada no balcão</span><span>—</span></li>'}<li class="tot"><span>Total${consulta ? ' parcial' : ''}</span><span>${brl(t)}</span></li></ul>`;
}
function textoPedido() {
  const { t, consulta } = total();
  const l = Object.entries(S.cart).map(([k, q]) => `- ${q}x ${k}${MENU[k]?.p ? ' (' + brl(MENU[k].p * q) + ')' : ' (a consultar)'}`);
  return ['Olá, Sabor na Brasa! Quero fazer um pedido:', ...l,
    S.modo === 'entrega' ? `- Entrega na Rocinha (${brl(ENTREGA)})` : '- Vou buscar no balcão',
    `Total: ${brl(t)}${consulta ? ' + itens a consultar' : ''}`, `Nome: ${S.nome}`, S.endereco ? `Endereço: ${S.endereco}` : ''].filter(Boolean).join('\n');
}

/* ---------- Conversa ---------- */
function saudacao() {
  S.passo = 1; save();
  bot('Olá! Eu sou o Brasinha, do Sabor na Brasa.\nMonto seu pedido aqui em poucos toques e envio pronto para o nosso WhatsApp. O que vai ser hoje?', PRINCIPAIS);
}
function acao(act, label) {
  if (label) eu(label);
  const [tipo, arg] = act.split(':');
  if (tipo === 'add') {
    add(arg); S.passo = 1;
    const p = MENU[arg]?.p;
    if (arg === 'Comida do buffet') return bot(`Anotado: 1x Comida do buffet (${brl(33)}).\nQuer colocar churrasco misto por cima? Fica ${brl(40)}.`, [['Trocar por buffet + churrasco', 'up'], ...MAIS]);
    return bot(`Anotado: 1x ${arg}${p ? ` (${brl(p)})` : ''}.${p ? '' : '\nO valor desse item a equipe confirma no WhatsApp.'}\nQuer mais alguma coisa?`, MAIS, { img: MENU[arg]?.img && p ? MENU[arg].img : undefined });
  }
  if (act === 'up') { if (S.cart['Comida do buffet']) { S.cart['Comida do buffet']--; if (!S.cart['Comida do buffet']) delete S.cart['Comida do buffet']; } add('Buffet + churrasco misto'); return bot(`Feito. Trocado por Buffet + churrasco misto (${brl(40)}), o mais pedido da casa.`, MAIS, { img: 'quentinha' }); }
  if (act === 'carnes') return bot('Hoje na brasa: fraldinha, picanha, coração de frango e espetinhos de carne, linguiça e frango.\nToque para adicionar.', [['Fraldinha', 'add:Fraldinha'], ['Picanha', 'add:Picanha'], ['Coração de frango', 'add:Coração de frango'], ['Espetinhos', 'add:Espetinhos'], ['Fechar pedido', 'fechar', 'main']], { img: 'aovivo' });
  if (act === 'acomp') return bot('Acompanhamentos da casa:', [['Batata frita', 'add:Batata frita'], ['Salada de maionese', 'add:Salada de maionese'], ['Farofa da casa', 'add:Farofa da casa'], ['Fechar pedido', 'fechar', 'main']]);
  if (act === 'inicio') return bot('Nosso cardápio de almoço:', PRINCIPAIS);
  if (act === 'info') return bot('Estamos na Estrada da Gávea, 413, na Rocinha.\nEntregamos em toda a Rocinha por R$ 4,00. Também dá pra retirar no balcão.', itens() ? MAIS : PRINCIPAIS);
  if (act === 'fechar') {
    if (!itens()) return bot('Seu pedido ainda está vazio. Escolha um prato para começar:', PRINCIPAIS);
    S.passo = 2; save();
    return bot('Perfeito. Vai ser entrega ou você retira no balcão?', [['Entrega · R$4', 'modo:entrega', 'main'], ['Vou buscar', 'modo:retirada'], ['Adicionar mais itens', 'inicio']]);
  }
  if (tipo === 'modo') { S.modo = arg; S.etapa = 'nome'; save(); return bot('Qual o seu nome?', []); }
  if (act === 'enviar') return enviar();
  if (act === 'editar') { S.passo = 1; save(); return bot('Claro. O que mais você quer adicionar?', MAIS); }
}
function ouvir(txt) {
  eu(txt);
  const t = norm(txt), q = +(t.match(/(?:^|\s)(\d{1,2})(?!\d)/) || [])[1] || 1;
  if (S.etapa === 'nome') { S.nome = txt; S.etapa = S.modo === 'entrega' ? 'endereco' : null; save(); return S.etapa ? bot(`Prazer, ${S.nome}. Qual o endereço de entrega? Rua, número e um ponto de referência.`, []) : resumo(); }
  if (S.etapa === 'endereco') { S.endereco = txt; S.etapa = null; save(); return resumo(); }

  const achou = (re, item) => re.test(t) && (add(item, q), bot(`Anotado: ${q}x ${item}${MENU[item].p ? ` (${brl(MENU[item].p * q)})` : ''}. Quer mais alguma coisa?`, MAIS), true);
  if (achou(/misto|com churrasco|buffet ?\+|40/, 'Buffet + churrasco misto')) return;
  if (achou(/quentinha|marmita|completa/, 'Quentinha completa')) return;
  if (achou(/buffet|comida caseira|33/, 'Comida do buffet')) return;
  for (const k of Object.keys(MENU)) if (t.includes(norm(k).split(' ')[0]) && k.length > 6 && MENU[k].p == null) { add(k, q); return bot(`Anotado: ${q}x ${k}. O valor a equipe confirma no WhatsApp. Mais alguma coisa?`, MAIS); }
  if (/espet|linguica|frango/.test(t)) { add('Espetinhos', q); return bot(`Anotado: ${q}x Espetinhos. Mais alguma coisa?`, MAIS); }
  if (/carne|brasa|cardapio|menu|o que tem/.test(t)) return acao('carnes');
  if (/onde|endereco|fica|local|entrega|taxa|delivery/.test(t)) return acao('info');
  if (/hora|horario|abre|fecha /.test(t)) return bot('Servimos almoço todos os dias. Para confirmar o horário de hoje, fale com a equipe no WhatsApp.', [['Abrir WhatsApp', 'zap', 'wa'], ...(itens() ? MAIS : PRINCIPAIS)]);
  if (/fechar|finalizar|so isso|pronto|e isso|acabou|enviar/.test(t)) return acao('fechar');
  if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai|eai|salve)/.test(t)) return bot('Olá! Vamos montar seu pedido? Escolha uma opção:', PRINCIPAIS);
  bot('Não entendi bem. Toque em uma das opções abaixo, ou fale direto com a equipe no WhatsApp.', [...(itens() ? MAIS : PRINCIPAIS)]);
}
function resumo() {
  S.passo = 3; save();
  bot(`Pronto, ${S.nome}. Confira seu pedido:`, [['Enviar pelo WhatsApp', 'enviar', 'wa'], ['Adicionar mais', 'editar'], ['Recomeçar', 'reset']], { sum: true });
}
async function enviar() {
  if (!itens()) return bot('Escolha pelo menos um item antes de enviar.', PRINCIPAIS);
  if (!S.nome) return acao('fechar');
  const txt = textoPedido();
  if (WA_NUMERO) { window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener'); return bot('Abri o WhatsApp com seu pedido escrito. É só tocar em enviar na conversa.', [['Abrir de novo', 'enviar', 'wa']]); }
  let copiou = false; try { await navigator.clipboard.writeText(txt); copiou = true; } catch (e) {}
  const w = window.open(WA_LINK, '_blank', 'noopener');
  bot(copiou ? 'Copiei seu pedido e abri o WhatsApp da casa.\nNa conversa, toque e segure no campo de mensagem, escolha Colar e envie.' : 'Abri o WhatsApp da casa. Copie o resumo acima e envie na conversa.', [['Abrir WhatsApp de novo', 'zap', 'wa'], ['Recomeçar', 'reset']]);
  if (!w) location.href = WA_LINK;
}

/* atalhos que não passam pela conversa */
const _acao = acao;
acao = function (act, label) {
  if (act === 'zap') { eu(label); window.open(WA_NUMERO ? `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(itens() && S.nome ? textoPedido() : 'Olá, Sabor na Brasa!')}` : WA_LINK, '_blank', 'noopener'); return; }
  if (act === 'reset') { S = novo(); save(); instancias.forEach(i => (i.ui.msgs.innerHTML = '')); return saudacao(); }
  return _acao(act, label);
};

window.Brasinha = { mount };
document.querySelectorAll('[data-bot]').forEach(el => {
  const api = mount(el);
  const item = new URLSearchParams(location.search).get('item');
  if (item && MENU[item]) setTimeout(() => api.pedir(item), 900);
});
})();
