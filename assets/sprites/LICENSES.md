# Creditos dos assets visuais do banner

O banner (`src/Banner.html` + `src/SpriteEngine.html`) e uma cena noturna
nordica estatica (Yggdrasil, corvos de Odin, pedras rúnicas, montanhas
geladas) desenhada majoritariamente em canvas puro (vetores/formas
proceduais - sem licenciamento envolvido, autoral deste projeto).

Os unicos arquivos binarios usados sao os dois corvos abaixo, que
representam Huginn e Muninn (literalmente o nome do app, "Codex Munin" =
"codice de Muninn").

| Arquivo | Origem | Licenca |
|---|---|---|
| `raven/huginn.png` | Recorte de "Pixel Raven" por Commander, OpenGameArt.org — https://opengameart.org/content/pixel-raven | CC0 1.0 (dominio publico) |
| `raven/muninn.png` | Recorte de "Pixel Raven" por Commander, OpenGameArt.org — https://opengameart.org/content/pixel-raven | CC0 1.0 (dominio publico) |

Ambos os arquivos sao o mesmo spritesheet original (`raven_2.png`, 2 poses
lado a lado) separado em 2 PNGs individuais, com o fundo (um unico
retangulo solido de cor, nao faz parte da arte) removido via color-key para
ficar transparente. CC0 nao exige atribuicao, mas o credito ao autor
original ("Commander") fica registrado aqui por boa pratica.

Para trocar qualquer elemento da cena por outra arte (ainda preferencialmente
CC0), edite `src/SpriteEngine.html` — a composicao e feita inteiramente por
funcoes `draw*_()` claramente nomeadas (ceu, aurora, estrelas, lua, montanhas,
arvore, pedras rúnicas, corvos).
