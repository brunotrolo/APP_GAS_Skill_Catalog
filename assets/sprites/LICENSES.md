# Creditos dos assets visuais do banner

O banner (`src/Banner.html` + `src/SpriteEngine.html`) e uma cena noturna
nordica (Yggdrasil, corvos de Odin, pedras rúnicas, montanhas geladas)
desenhada majoritariamente em canvas puro (vetores/formas proceduais - sem
licenciamento envolvido, autoral deste projeto), com um guerreiro viking
animado (correr/parado/golpe de machado) cruzando a cena.

| Arquivo | Origem | Licenca |
|---|---|---|
| `raven/huginn.png` | Recorte de "Pixel Raven" por Commander, OpenGameArt.org — https://opengameart.org/content/pixel-raven | CC0 1.0 (dominio publico) |
| `raven/muninn.png` | Recorte de "Pixel Raven" por Commander, OpenGameArt.org — https://opengameart.org/content/pixel-raven | CC0 1.0 (dominio publico) |
| `hero/idle.png` | "Viking - 2D Pixel Art Character Pack" por ByteBox, itch.io — https://bytebox.itch.io/viking-character-2d (arquivo original `sidrug_idle.png`) | Gratuito p/ uso pessoal e comercial. **Nao** pode ser revendido/redistribuido/reempacotado como produto autonomo nem subido para outras lojas de assets (ver "Licenca" abaixo) |
| `hero/run.png` | Idem acima (arquivo original `sidrug_run.png`) | Idem acima |
| `hero/attack.png` | Idem acima (arquivo original `sidrug_attack1.png`) | Idem acima |

## Nota sobre a licenca do heroi (nao-CC0)

Diferente dos corvos (CC0 puro), o pack do guerreiro viking usa uma licenca
"free to use" mais comum em asset packs de alta qualidade com animacao
quadro-a-quadro real: uso livre em projetos pessoais e comerciais, edicao
permitida, mas proibido revender/redistribuir o asset em si como produto
autonomo ou subi-lo para outra loja de assets. Isso e compativel com o uso
feito aqui (embutido como parte do app, nao distribuido separadamente), mas
e uma licenca diferente de CC0 - documentado aqui para transparencia. Texto
original do autor (ByteBox): "This asset is free to use in personal and
commercial projects. You are welcome to edit and adapt it to fit your
needs. However, you may NOT resell, redistribute, or repackage this asset
— in its original form or modified — as a standalone product. Do not
upload it to other asset stores or marketplaces."

Para trocar qualquer elemento da cena por outra arte, edite
`src/SpriteEngine.html` — a composicao e feita por funcoes `draw*_()`
claramente nomeadas (ceu, aurora, estrelas, lua, montanhas, arvore, pedras
rúnicas, corvos, heroi).
