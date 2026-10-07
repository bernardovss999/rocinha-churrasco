/* Brasinha — PRÉVIA do agente de pedidos.
   Hoje responde com regras simples a partir do conteúdo do Instagram.
   Na versão final, troque responder() por uma chamada à IA (ex.: API do Claude) e ao WhatsApp Business. */
const MENU = {
  'Comida do buffet': 33,
  'Buffet + churrasco misto': 40,
  'Quentinha completa': 40,
  'Fraldinha': null, 'Picanha': null, 'Coração de frango': null, 'Espetinhos': null,
  'Batata frita': null, 'Salada de maionese': null, 'Farofa da casa': null
};
const ENTREGA = 4;
const cart = {}; let modo = null, etapa = null, nome = '', endereco = '';
const msgs = document.getElementById('msgs'), quick = document.getElementById('quick');
const brl = v => 'R$' + v.toFixed(2).replace('.', ',');

function bubble(txt, who = 'bot', img) {
  const d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = txt;
  if (img) { const i = new Image(); i.src = img; i.alt = ''; d.append(i); }
  msgs.append(d); msgs.scrollTop = msgs.scrollHeight;
}
function bot(txt, opts = [], img) {
  quick.innerHTML = '';
  const t = document.createElement('div'); t.className = 'msg bot'; t.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
  msgs.append(t); msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => { t.remove(); bubble(txt, 'bot', img); chips(opts); navigator.vibrate?.(6); }, 500 + Math.min(1100, txt.length * 12));
}
function chips(opts) {
  quick.innerHTML = '';
  opts.forEach((o, i) => { const b = document.createElement('button'); b.textContent = o; b.style.animationDelay = i * .06 + 's'; b.onclick = o === '📲 Enviar no Zap' ? enviar : () => ouvir(o); quick.append(b); });
}
function totalItens() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function total() { let t = 0, consulta = false; for (const [k, q] of Object.entries(cart)) { if (MENU[k] == null) consulta = true; else t += MENU[k] * q; } if (modo === 'entrega') t += ENTREGA; return { t, consulta }; }
function atualizaBarra() {
  const bar = document.getElementById('cartBar'), n = totalItens();
  bar.classList.toggle('on', n > 0);
  const { t, consulta } = total();
  document.getElementById('cartTxt').textContent = `🧾 ${n} ${n > 1 ? 'itens' : 'item'} • ${brl(t)}${consulta ? ' + itens a consultar' : ''}`;
}
function add(item, q = 1) { cart[item] = (cart[item] || 0) + q; atualizaBarra(); }

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const PRINCIPAIS = ['🍽️ Buffet R$33', '🥩 Buffet + churrasco R$40', '🔥 Carnes na brasa', '📍 Onde fica?', '🛵 Entrega?'];

function ouvir(txt) {
  bubble(txt, 'me');
  const t = norm(txt), q = +(t.match(/(?:^|\s)(\d{1,2})(?!\d)/) || [])[1] || 1;

  if (etapa === 'nome') { nome = txt; etapa = modo === 'entrega' ? 'endereco' : null; return modo === 'entrega' ? bot(`Prazer, ${nome}! 😄 Qual o endereço na Rocinha? (rua, número, ponto de referência)`) : fechar(); }
  if (etapa === 'endereco') { endereco = txt; etapa = null; return fechar(); }

  if (/entrega \(|^🛵 entrega/.test(t) || t.includes('entrega (r$4)')) { modo = 'entrega'; etapa = 'nome'; atualizaBarra(); return bot('Show! Qual seu nome?'); }
  if (/buscar|retirar|vou ai/.test(t)) { modo = 'retirada'; etapa = 'nome'; return bot('Beleza! Qual seu nome pra gente separar?'); }
  if (/buffet \+|churrasco misto|misto|40/.test(t)) { add('Buffet + churrasco misto', q); return bot(`Boa escolha! 🥩 ${q}x Buffet + churrasco misto (R$40). É o mais pedido da casa!\nQuer mais alguma coisa?`, ['➕ Batata frita', '➕ Farofa da casa', '🔥 Carnes na brasa', '✅ Fechar pedido'], 'img/quentinha.jpg'); }
  if (/quentinha completa/.test(t)) { add('Quentinha completa', q); return bot('Anotado! Quentinha completa com churrasco, fritas, maionese e farofa. 😋', ['✅ Fechar pedido', '🍽️ Buffet R$33']); }
  if (/buffet|33|comida caseira/.test(t)) { add('Comida do buffet', q); return bot(`Anotei ${q}x Comida do buffet (R$33). Comida caseira, fresquinha! 🍽️\nQuer colocar churrasco por cima por mais R$7?`, ['🥩 Buffet + churrasco R$40', '✅ Fechar pedido']); }
  if (/carne|brasa|cardapio|churrasco|o que tem/.test(t) && !/\+/.test(t)) return bot('Na brasa hoje tem: fraldinha, picanha, coração de frango e espetinhos (carne, linguiça e frango). 🔥\nO valor dessas a gente confirma no Zap.', ['➕ Fraldinha', '➕ Picanha', '➕ Coração de frango', '➕ Espetinhos'], 'img/cortes.jpg');
  for (const k of Object.keys(MENU)) if (t.includes(norm(k))) { add(k, q); return bot(`${q}x ${k} anotado! ✅ ${MENU[k] ? '' : '(preço confirmado no WhatsApp)'}`, ['🔥 Carnes na brasa', '🥩 Buffet + churrasco R$40', '✅ Fechar pedido']); }
  if (/onde|endereco|fica|local/.test(t)) return bot('Ficamos na Estrada da Gávea, 413 — Rocinha. 📍\nPode vir comer aqui ou pedir que a gente leva!', ['🛵 Entrega?', '🍽️ Buffet R$33']);
  if (/entrega|delivery|leva/.test(t)) return bot('Entregamos na Rocinha por só R$4! 🛵 Chega quentinho.', ['🍽️ Buffet R$33', '🥩 Buffet + churrasco R$40']);
  if (/foto|ver/.test(t)) return bot('Olha que delícia 😍 Tem mais na página de fotos!', PRINCIPAIS, 'img/nivela.jpg');
  if (/fechar|finalizar|so isso|pronto|acabou/.test(t)) {
    if (!totalItens()) return bot('Seu pedido ainda tá vazio 😅 Bora escolher?', PRINCIPAIS);
    return bot('Fechou! Vai ser entrega ou você vem buscar?', ['🛵 Entrega (R$4)', '🚶 Vou buscar']);
  }
  if (/oi|ola|bom dia|boa tarde|boa noite|eai|salve/.test(t)) return bot('Fala! 🔥 Sou o Brasinha. Bora montar sua quentinha?', PRINCIPAIS);
  bot('Ainda tô aprendendo 😅 (sou uma prévia). Toca numa opção aqui embaixo:', PRINCIPAIS);
}

function textoPedido() {
  const linhas = Object.entries(cart).map(([k, q]) => `• ${q}x ${k}${MENU[k] ? ' — ' + brl(MENU[k] * q) : ' — (consultar)'}`);
  const { t, consulta } = total();
  return `Olá, Sabor na Brasa! 🔥 Quero fazer um pedido:\n${linhas.join('\n')}\n${modo === 'entrega' ? '🛵 Entrega: ' + brl(ENTREGA) + '\n' : '🚶 Vou buscar\n'}Total: ${brl(t)}${consulta ? ' + itens a consultar' : ''}\nNome: ${nome}${endereco ? '\nEndereço: ' + endereco : ''}`;
}
function fechar() {
  atualizaBarra();
  bot('Tá aqui seu pedido 👇\n\n' + textoPedido() + '\n\nToca em “Enviar no Zap” que eu copio a mensagem e abro o WhatsApp. É só colar e mandar!', ['📲 Enviar no Zap']);
}
async function enviar() {
  if (!totalItens()) return toast('Escolha pelo menos um item 😉');
  if (!nome) return ouvir('✅ Fechar pedido');
  try { await navigator.clipboard.writeText(textoPedido()); toast('Pedido copiado! Cole no WhatsApp 📋'); } catch (e) { toast('Abra o WhatsApp e mande seu pedido 😉'); }
  setTimeout(() => window.open(WA, '_blank', 'noopener'), 700);
}
document.getElementById('send').onclick = enviar;
document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); const i = document.getElementById('inp'); if (i.value.trim()) { ouvir(i.value.trim()); i.value = ''; } });

/* início — se veio do cardápio com ?item= já adiciona */
const vindo = new URLSearchParams(location.search).get('item');
setTimeout(() => {
  bot('Fala! 🔥 Eu sou o Brasinha, atendente virtual do Sabor na Brasa.\nTe ajudo a montar o pedido e mando pro nosso WhatsApp.', vindo ? [] : PRINCIPAIS);
  if (vindo && vindo in MENU) setTimeout(() => ouvir(vindo), 1600);
}, 400);
