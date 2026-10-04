# Tema: Escuro (padrão)

Tema padrão do Codex Munin — pixel art moderno, tons escuros com acento dourado,
inspirado em games retrô mas com acabamento mais "desenhado" (gradientes suaves,
glow, cantos arredondados) em vez de 8-bit chapado.

## Cores por papel

| Variável CSS | Valor | Papel |
|---|---|---|
| `--bg-deep` | `#0a0b16` | Fundo geral da página |
| `--bg-panel` | `#181a2c` | Fundo de painéis (sidebar, modal, busca) |
| `--bg-card` | `#1d2037` | Fundo dos cards de skill e inputs |
| `--bg-card-hover` | `#262a47` | Fundo de card/botão em hover, topo dos gradientes |
| `--border-ink` | `#000000` | Cor das bordas "pixeladas" (preto puro) |
| `--text-main` | `#f3f4fc` | Texto principal |
| `--gold` | `#ffd84a` | Cor de destaque/ação principal (botões, títulos) |
| `--gold-glow` | `#ffe98a` | Topo dos gradientes dourados, glow de hover |
| `--purple` | `#b06aed` | Badge "Curadoria", acentos secundários |
| `--terminal-green` | `#2effa0` | Tags, categoria "Software Engineering", sucesso |
| `--danger` | `#ff5d6c` | Erros, toast de erro, categoria "Debugging" |
| `--muted` | `#b7b9d8` | Texto secundário (meta, autor, descrições) |

## Tipografia

- **Títulos, botões, badges, cards de módulo**: `Pixelify Sans` (pixel-art
  moderno, mais legível que fontes pixeladas clássicas tipo Press Start 2P).
- **Corpo de texto, inputs, resumos**: `Space Mono` (monoespaçada, legível em
  tamanhos pequenos).
- Ambas carregadas via Google Fonts em `src/Stylesheet.html`.

## Raios de borda

- `--radius-s: 6px` — botões, inputs, pills.
- `--radius-m: 10px` — painéis, cards, modais.

## Onde isso vive no código

A fonte da verdade executável é o objeto `THEMES.dark` em `src/Script.html`
(aplicado em tempo real via `document.documentElement.style.setProperty`). Este
arquivo é a documentação legível do mesmo tema — se os dois divergirem, o código
manda.
