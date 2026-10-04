# Licencas dos spritesheets do banner Hi-Bit

Esta pasta guarda os spritesheets PNG usados pelo motor de banner
(`src/SpriteEngine.html`), servidos em producao via jsDelivr CDN apontando
para este repositorio (o Google Apps Script HtmlService nao serve arquivos
estaticos de uma pasta em tempo de execucao).

**Status atual: pasta vazia / placeholders.** Os PNGs reais ainda nao foram
adicionados. Enquanto isso, `src/SpriteEngine.html` usa um tipo de entidade
de emergencia (desenhado em blocos de pixel via canvas) para o banner nunca
ficar vazio — ver comentarios em `ENTITY_CONFIGS` nesse arquivo.

## Passo a passo para adicionar os assets reais (manual)

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

## Registro de licencas (preencher ao adicionar cada arquivo)

| Arquivo | Pack de origem | URL | Data do download | Licenca confirmada |
|---|---|---|---|---|
| _(nenhum arquivo adicionado ainda)_ | | | | |
