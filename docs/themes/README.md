# Temas do Codex Munin

Esta pasta guarda a especificação (em Markdown) de cada tema visual do app. O
motor de temas em si roda em `src/Script.html` (objeto `THEMES`) e troca as
variáveis CSS em tempo real, sem reload — ver `current-theme.md` para o tema
"Escuro (padrão)" já aplicado.

## Como propor um tema novo

Para que um novo tema seja aplicado ao app, crie um arquivo `.md` nesta pasta
(ex: `nome-do-tema.md`) seguindo este formato — quanto mais completo, mais fiel
fica a tradução para código:

```markdown
# Tema: <Nome do tema>

Uma frase descrevendo o clima/referência visual do tema.

## Cores por papel

| Variável CSS | Valor | Papel |
|---|---|---|
| `--bg-deep` | `#______` | Fundo geral da página |
| `--bg-panel` | `#______` | Fundo de painéis |
| `--bg-card` | `#______` | Fundo dos cards |
| `--bg-card-hover` | `#______` | Fundo em hover |
| `--border-ink` | `#______` | Cor das bordas |
| `--text-main` | `#______` | Texto principal |
| `--gold` | `#______` | Cor de destaque/ação principal |
| `--gold-glow` | `#______` | Glow/topo de gradiente do destaque |
| `--purple` | `#______` | Acento secundário (badge Curadoria) |
| `--terminal-green` | `#______` | Tags, sucesso |
| `--danger` | `#______` | Erros |
| `--muted` | `#______` | Texto secundário |

## Observações (opcional)

Qualquer nota extra: fontes diferentes, se é um tema claro ou escuro, referência
de jogo/filme/paleta, etc.
```

Não é obrigatório preencher todas as cores — para qualquer uma que faltar, o
tema "Escuro (padrão)" é usado como base.

## O que acontece depois que você adiciona um arquivo aqui

Este Markdown é só a especificação: o app publicado (Google Apps Script) não lê
arquivos deste repositório em tempo real. Depois que você adicionar ou editar um
`.md` aqui, peça para o Claude aplicar o tema — ele traduz a tabela de cores
para uma nova entrada em `THEMES` (`src/Script.html`), adiciona na lista de
temas da sidebar, e publica a atualização.
