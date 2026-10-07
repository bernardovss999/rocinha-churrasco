# Sabor na Brasa — site

Site estático (HTML, CSS e JS puros) da Churrascaria Sabor na Brasa, Rocinha.

- `index.html`, `cardapio.html`, `pedido.html`, `fotos.html`, `sobre.html`, `contato.html`
- `style.css` — visual (carvão, creme e cobre; fonte Archivo)
- `app.js` — topo, menu, rodapé, botão do Brasinha, galeria
- `agente.js` — Brasinha, o atendente de pedidos que envia o pedido para o WhatsApp

## WhatsApp com pedido já escrito

Em `agente.js`, preencha `WA_NUMERO` com o número da casa (ex.: `5521999999999`).
Com o número, o pedido abre já digitado na conversa. Sem ele, o Brasinha copia o
pedido e abre o link `wa.me/message/...`, e o cliente cola a mensagem.

## Fotos em alta resolução

As fotos originais ficam em `img/originais/` e o arquivo `tools/imagens.json` diz
qual arquivo vai em cada posição do site (`aovivo`, `quentinha`, `logo`...).
Para trocar pelas versões 4K:

1. Coloque as fotos em `img/originais/` (ou outra pasta).
2. Ajuste os nomes em `tools/imagens.json`, se forem diferentes.
3. Rode `python3 tools/otimizar-imagens.py img/originais` (precisa de `pip install pillow`).

O script gera versões leves em WebP (640, 1280 e 1920 px) e um JPG de reserva.
O navegador baixa só o tamanho certo para cada tela. A logo é só redimensionada,
nunca alterada.
