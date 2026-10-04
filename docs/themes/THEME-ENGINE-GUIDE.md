# Guia do motor de temas (Codex Munin)

Este documento existe para que aplicar um novo `DESIGN-*.md` vire um
procedimento mecânico, não uma releitura artesanal a cada tema novo. Ele
documenta o algoritmo que já foi usado (e corrigido) nos 4 temas atuais
(Retro, Apple, BMW, OpenCode) para que os próximos ~20 sigam a mesma régua.

## Por que isso existe

O Google Apps Script não lê arquivos do repositório em tempo de execução
(`HtmlService` só serve os arquivos que o `clasp push` publica). Por isso
cada `docs/themes/DESIGN-*.md` é uma especificação que alguém (hoje, eu)
traduz manualmente para um arquivo `ThemeX.html` com os tokens CSS abaixo.
Este guia reduz essa tradução a um checklist, não a uma reinterpretação.

## Arquitetura (não mexer sem necessidade)

- `src/ThemeController.html`: só troca os atributos `data-theme-family` e
  `data-theme` em `<html>` e persiste em `localStorage`. Não guarda cores.
- `src/Theme<Nome>.html`: um `<style>` puro por família, com dois blocos
  `:root[data-theme-family="x"][data-theme="dark"|"light"] { --var: valor; }`.
- Cada tema novo = 1 arquivo novo + 1 linha em `THEME_LIST` (ThemeController)
  + 1 `<?!= include('ThemeNovo'); ?>` em `Index.html`.

## O contrato de tokens (toda família precisa definir todos estes)

| Token | Papel | De onde tirar no design.md |
|---|---|---|
| `--bg-deep` | fundo mais profundo da página | `colors.canvas` (ou o tom de superfície mais escuro/claro do arquivo) |
| `--bg-panel` | fundo de painel/sidebar | superfície secundária (`canvas-parchment`, `surface-soft`, etc.) |
| `--bg-card` | fundo de card | superfície de card (`surface-tile-*`, `surface-card`) |
| `--bg-card-hover` | hover de card | 1 passo mais claro/escuro que `bg-card`, se o arquivo definir um |
| `--border-ink` | borda/hairline | `hairline` / `divider-soft` |
| `--text-main` | texto principal | `ink` / `body` / `on-dark` conforme o modo |
| `--muted` | texto secundário | `body-muted` / `ink-muted-*` / `muted` |
| `--gold`, `--gold-glow` | **Brand** — ver regra dedicada abaixo | ver "Como achar o Brand" |
| `--on-accent` | texto de contraste sobre `--gold` | branco ou preto, o que der contraste - nunca um hex novo |
| `--purple`, `--info`, `--warn`, `--terminal-green`, `--danger` | papéis semânticos sem destino óbvio | reusar outro token literal do MESMO arquivo (nunca inventar hex) - ver "Papéis sem equivalente literal" |
| `--cat-1` .. `--cat-6`, `--on-cat` | ladder de categorias/tags | 6 tons literais e distintos do arquivo (ver regra própria) |
| `--chrome-gradient-success` | CTA universal do app (botão "Baixar .ZIP") | ver "O botão de download" |
| `--chrome-gradient-accent/-card/-panel/-curadoria` | normalmente = `var(--gold)` / `var(--bg-card)` / `var(--bg-panel)` / `var(--purple)` | sem gradiente real se o arquivo disser "no decorative gradients" |
| `--font-heading/-body/-display` | tipografia | ver "Fontes" |
| `--radius-s`, `--radius-m` | raio de borda | ver "Forma" |
| `--border-width` | espessura de borda | geralmente `1px` se o arquivo descreve hairline |
| `--shadow-chunky` | sombra do app (`inset` 3D) | `none` se o arquivo disser "no shadows"/"flat"; senão, usar a sombra descrita |
| `--letter-spacing-heading`, `--heading-transform` | tipografia de título | negativo + `none` (ex. Apple) ou `0` + `uppercase` (ex. BMW), conforme o arquivo |
| `--ambient-glow` | glow decorativo de fundo | `none` para marcas "no decorative gradients/no shadows" |

**Nunca usar um hex que não apareça literalmente no arquivo.** Quando um
papel não tem equivalente (ex. Apple não tem verde/vermelho), reusar outro
token literal do MESMO arquivo — nunca a cor "óbvia" de outra marca (não
usar verde-sistema da Apple real, usar um cinza do próprio arquivo).

## Como achar o Brand (`--gold`)

Esta foi a causa dos 3 bugs encontrados no OpenCode (botão verde, título
azul, tag laranja) — o algoritmo usado para corrigir:

1. Olhar `components.button-primary.backgroundColor` no YAML. Se resolver
   para uma cor com matiz (não neutra: não é preto/branco/cinza), **essa é
   o Brand**. (Ex.: Apple → `{colors.primary}` = azul.)
2. Se `button-primary.backgroundColor` for neutro (preto/branco/cinza) mas
   a prosa do arquivo descrever explicitamente OUTRO token como
   "signature"/"iconic"/"the brand" (ex. BMW chama `m-red` de "the
   signature M-power red" em três seções diferentes), usar esse token
   nomeado como Brand — é o que o arquivo mesmo está dizendo que É a
   marca, mesmo que o botão literal do site real seja monocromático.
3. Se nem 1 nem 2 derem uma cor com matiz (ex. OpenCode: botão é
   preto/branco, e não há nenhum "signature hue" nomeado em lugar nenhum),
   o Brand É literalmente neutro. Nesse caso, inverter entre os dois modos
   só para manter contraste (claro no escuro, escuro no claro) — nunca
   inventar um matiz que o arquivo não tem.
4. Documentar a decisão no comentário do topo do arquivo `ThemeX.html`,
   citando a seção do `.md` que embasou a escolha.

## O botão de download (`--chrome-gradient-success`)

No app, o botão "BAIXAR .ZIP" é a ação universal e onipresente — aparece
em TODO card — o equivalente ao `components.button-primary` de cada
marca, não necessariamente ao token chamado literalmente `success` no
YAML. Regra: **usar sempre `var(--gold)`**, mesmo quando o arquivo define
um token `success`/verde dedicado.

Por quê: um token `success` literal (ex. BMW: `success: #0fa336`) quase
sempre vem descrito no arquivo como um estado raro e específico ("order
confirmation states", "rare on marketing surfaces") — o oposto de um botão
que aparece em toda tela do app. Usar esse verde raro como a cor mais
visível e repetida do app contradiz a própria instrução de uso do
arquivo, mesmo que o hex em si seja literal. O papel que o botão de
download ocupa no app (CTA principal, onipresente) é sempre o do Brand,
nunca o de um estado semântico raro — foi exatamente o erro corrigido no
tema BMW (verde no botão de download, quando o arquivo já nomeia o
vermelho como "the signature" cor onipresente da marca).

## O ladder de categorias (`--cat-1` .. `--cat-6`, `--on-cat`)

Nunca reusar os 6 papéis semânticos genéricos (`--gold/--terminal-green/
--danger/--info/--purple/--warn`) para tags/categorias — é exatamente o
bug "tag laranja" do OpenCode. Em vez disso:

1. Escolher 6 tons **literais e distintos** da paleta do próprio arquivo
   (misturando Brand + tons de Surface/Text se a marca for monocromática,
   como OpenCode: ink/charcoal/body/mute/stone/ash).
2. `--on-cat` é um token à parte de `--on-accent`, porque `--on-accent`
   pode inverter por modo (acompanhando o Brand) enquanto o ladder de
   categorias pode ter um brilho fixo nos dois modos (ex. OpenCode: tons
   sempre médio/escuros exigem texto sempre claro, nos dois modos).

## Fontes

1. Usar a `fontFamily` literal do YAML (`typography.*.fontFamily`) como
   primeira entrada da pilha.
2. Se a fonte for proprietária/paga (BMW Type Next Latin, SF Pro), olhar a
   seção **"Note on Font Substitutes"** do próprio arquivo — ela já
   recomenda um substituto (ex. BMW recomenda "Inter"; Apple recomenda
   `system-ui, -apple-system, BlinkMacSystemFont` porque isso resolve pra
   SF Pro de verdade no Safari/macOS).
3. **Nunca inventar uma fonte que não é citada no arquivo** (bug corrigido
   neste guia: BMW usava `'Arial Black'/Helvetica`, que não aparecem em
   lugar nenhum do `DESIGN-bmw-m.md`).
4. Se o substituto recomendado não for uma fonte de sistema, adicionar ao
   `@import` do Google Fonts no topo de `src/Stylesheet.html` (um único
   import compartilhado por todos os temas).

## Forma (raios, borda, sombra)

1. Ler a tabela `rounded:` do YAML e o texto de `## Shapes`.
2. `--radius-s` = o raio usado em botões/controles pequenos; `--radius-m` =
   o raio usado em cards. Se o arquivo disser "o raio dominante é 0"
   (BMW) ou "botões são pill total" (Apple), isso vale pros DOIS tokens,
   não só pro botão.
3. `--shadow-chunky: none` sempre que o arquivo disser "no shadows on
   chrome"/"flat"/"no drop shadows" (Apple, BMW, OpenCode). Isso também
   zera glows decorativos que dependem do mesmo token em uma lista
   `box-shadow` multi-valor (um `none` nessa posição invalida a declaração
   inteira, voltando ao valor inicial `none` — não precisa de token extra).

## Checklist para cada tema novo (dos ~20 que virão)

1. Ler o YAML front-matter inteiro (`colors`, `typography`, `rounded`,
   `components`) antes de escrever qualquer CSS.
2. Achar o Brand (regra acima) e documentar a decisão no comentário do
   arquivo.
3. Preencher a tabela de tokens acima, um por um, citando de qual chave do
   YAML cada valor veio.
4. Resolver `--chrome-gradient-success` e o ladder de categorias com as
   regras dedicadas acima.
5. Criar `src/Theme<Nome>.html` com os dois blocos `:root[...]`.
6. Registrar em `THEME_LIST` (`src/ThemeController.html`) e incluir no
   `<head>` de `src/Index.html`.
7. Conferir balanceamento de chaves (`{`/`}`) no arquivo novo.
8. Nunca alterar `font-size` em nenhum token (regra permanente do app).
