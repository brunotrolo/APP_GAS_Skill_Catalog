# Licencas dos spritesheets do banner Hi-Bit

Esta pasta guarda os spritesheets PNG usados pelo motor de banner
(`src/SpriteEngine.html`), servidos em producao via jsDelivr CDN apontando
para este repositorio (o Google Apps Script HtmlService nao serve arquivos
estaticos de uma pasta em tempo de execucao).

**Status atual: assets reais ja adicionados** (4 spritesheets, um por
categoria), gerados a partir de packs 100% CC0 da Kenney.nl baixados
diretamente de kenney.nl/assets. Cada PNG foi recortado/recomposto (rotacao,
normalizacao de canvas, composicao de efeito) a partir dos arquivos originais
do pack — nenhum pixel foi desenhado do zero, so reempacotado para o formato
de spritesheet horizontal que `ENTITY_CONFIGS` espera. O tipo de emergencia em
`src/SpriteEngine.html` continua existindo como rede de seguranca caso um
PNG falhe ao carregar (CDN fora do ar, etc).

## Passo a passo para adicionar/trocar assets (manual)

Somente packs **CC0 / dominio publico** (sem exigencia de atribuicao) devem
ser usados aqui. Fontes recomendadas:

| Categoria | Pack sugerido | Onde buscar |
|---|---|---|
| `platformer/` | Kenney "Pixel Platformer" / "Platformer Characters" | kenney.nl/assets |
| `gunner/` | Kenney "Topdown Shooter" ou pack CC0 de "soldier" | kenney.nl/assets, itch.io (filtrar tag `cc0`) |
| `racer/` | Kenney "Racing Pack" / "Top-Down Tanks" (estilo veiculo) | kenney.nl/assets, itch.io (tag `cc0` + `racing`) |
| `spaceship/` | Kenney "Space Shooter Redux" | kenney.nl/assets |

1. Baixar o pack escolhido.
2. Abrir o `license.txt`/README do pack e confirmar que e **CC0** (nao CC-BY).
   Caso seja CC-BY (exige atribuicao), nao usar sem antes decidir onde dar
   o credito visivel no app.
3. Registrar aqui embaixo, por arquivo: nome do pack, URL de origem, data do
   download, e a confirmacao da licenca (pode copiar o trecho do license.txt).
4. Recortar a tira de frames da animacao desejada (correr/voar/dirigir) em um
   PNG unico, no formato `frameWidth x frameHeight x totalFrames` esperado
   pela entrada correspondente em `ENTITY_CONFIGS` (em
   `src/SpriteEngine.html`). Kenney normalmente entrega um spritesheet grande
   + atlas XML/JSON — este passo e so recortar/reempacotar, nao desenhar arte
   nova.
5. Salvar em `assets/sprites/<categoria>/<nome>.png` usando exatamente o nome
   de arquivo referenciado em `ENTITY_CONFIGS[*].src` (ex:
   `assets/sprites/platformer/hero-run.png`).
6. Commitar as mudancas nesta pasta.
7. Pegar o SHA do commit (`git rev-parse HEAD`) e atualizar a constante
   `ASSET_REF` no topo de `src/SpriteEngine.html` para esse SHA (URLs do
   jsDelivr com SHA sao cacheadas como imutaveis — sem precisar de purge
   manual de CDN a cada novo commit).
8. Seguir o fluxo normal de deploy do projeto (push → PR → merge →
   `deploy-gas.yml` com `create_deployment: true`).

## Registro de licencas

Todos os packs abaixo sao distribuidos pela Kenney (kenney.nl) sob **CC0 1.0
Universal** (dominio publico, atribuicao nao obrigatoria), conforme o
`License.txt` incluido em cada pack: "You can use this content for personal,
educational, and commercial purposes. Support by crediting 'Kenney' or
'www.kenney.nl' (this is not a requirement)." Data do download: 2026-10-04.

| Arquivo | Pack de origem | URL do pack | Licenca |
|---|---|---|---|
| `platformer/hero-run.png` | Kenney "Pixel Platformer" — recorte de 2 frames de `Tilemap/tilemap-characters_packed.png` | https://kenney.nl/assets/pixel-platformer | CC0 1.0 |
| `gunner/soldier-run.png` | Kenney "Top-down Shooter" — composicao de 3 poses (`soldier1_stand`, `soldier1_gun`, `soldier1_machine`) de `PNG/Soldier 1/` | https://kenney.nl/assets/top-down-shooter | CC0 1.0 |
| `racer/car-drive.png` | Kenney "Racing Pack" — `PNG/Cars/car_red_1.png`, rotacionado 90° para visao lateral | https://kenney.nl/assets/racing-pack | CC0 1.0 |
| `spaceship/fighter-fly.png` | Kenney "Space Shooter Extension" — `PNG/Sprites/Ships/spaceShips_001.png` rotacionado + 2 frames de propulsor (`PNG/Sprites/Effects/spaceEffects_001.png`/`_002.png`) | https://kenney.nl/assets/space-shooter-extension | CC0 1.0 |

Para trocar qualquer um desses por arte diferente (ainda CC0), siga o passo a
passo acima e atualize esta tabela.
