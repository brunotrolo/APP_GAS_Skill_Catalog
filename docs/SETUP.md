# Setup — Codex Munin

Passos manuais para colocar o Codex Munin (MVP) no ar.

> **Status atual**: a planilha e o projeto Apps Script já foram criados manualmente pelo usuário:
> - Google Sheets: `1-H5lMr3q_u9M1CYaqMCikZZRtP3ke4yVtwj7tuatp-0`
> - Apps Script: `1vQMqYIbWpfKcZwvSi0TH6oZjbqnwRvgfUUFEOp0qLZeJyzlfPQRWhfMB`
>
> Deploy autorizado. O envio do código (`clasp push`) é feito automaticamente via GitHub Actions (veja a seção 2A) — só falta você gerar o segredo `CLASP_CREDENTIALS` uma única vez, passo que exige login manual na sua conta Google.

## 1. Preparar a planilha (Google Sheets)

Na planilha já criada, adicione duas abas. **Confira item a item** (o app lê o header por posição de coluna, então nome e ordem precisam bater exatamente):

### Aba `Skills_Catalog`
Cabeçalho na linha 1, **exatamente estas 17 colunas, nesta ordem**:

| Col | Header |
|---|---|
| A | `id` |
| B | `nome` |
| C | `tipo` |
| D | `autor` |
| E | `resumo` |
| F | `categoria_primaria` |
| G | `tags` |
| H | `repo_url` |
| I | `owner` |
| J | `repo_name` |
| K | `default_branch` |
| L | `zip_url` |
| M | `clone_bash` |
| N | `clone_powershell` |
| O | `data_registro` |
| P | `registrado_por` |
| Q | `ativo` |

Pode ficar vazia — as linhas serão preenchidas pelo app.

### Aba `Categorias`
Cabeçalho `categoria` na coluna A, linha 1, seguido das 6 linhas seed:

```
Product & Upstream
Software Engineering
Debugging & Troubleshooting
Quality & Test Automation
DevOps & Release
Architecture & Workflows
```

Essa lista é editável depois (o app lê dinamicamente), mas precisa ter pelo menos uma categoria para o formulário de cadastro funcionar.

### Checklist rápido antes de prosseguir
- [ ] Aba `Skills_Catalog` existe, com as 17 colunas acima na ordem exata (sem colunas extras antes de `id`, sem renomear nenhuma).
- [ ] Aba `Categorias` existe, header `categoria`, com ao menos as 6 linhas seed.

Depois do `clasp push` (seção 2), você pode confirmar isso de forma automática: no editor do Apps Script, selecione a função `verifySheetSchema` no dropdown ao lado do botão "Run" (ou "Executar") e clique em Run. Ela só lê a planilha (não altera nada) e grava o resultado no "Execution log" — se houver qualquer divergência de nome/ordem de coluna, ela lista exatamente qual.

## 2. Enviar o código ao Apps Script

### 2A. Via GitHub Actions (recomendado — é o que está configurado)

O workflow `.github/workflows/deploy-gas.yml` roda `clasp push` automaticamente contra o script `1vQMqYIbWpfKcZwvSi0TH6oZjbqnwRvgfUUFEOp0qLZeJyzlfPQRWhfMB`. Ele precisa de **um segredo único** no repositório, gerado uma vez pela sua conta Google (a autenticação OAuth do clasp não pode ser feita por terceiros, só por você):

1. Na sua máquina: `npm install -g @google/clasp && clasp login` (abre o navegador, autorize com a conta Google dona da planilha/script).
2. Copie o conteúdo do arquivo gerado (`~/.clasprc.json` no Linux/Mac, `%USERPROFILE%\.clasprc.json` no Windows).
3. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**, nome `CLASP_CREDENTIALS`, cole o conteúdo do arquivo.
4. Na aba **Actions** do repositório, rode o workflow **Deploy to Google Apps Script** manualmente (`Run workflow`). Ele faz o `clasp push`; marque a opção "também criar/atualizar o deployment de Web App" se quiser que ele rode `clasp deploy` também.

Esse segredo só precisa ser gerado uma vez; os próximos deploys são só rodar o workflow de novo (ou ele pode ser configurado para rodar a cada push na branch principal).

### 2B. Manualmente (alternativa)

```bash
npm install
npx clasp login
npx clasp clone 1vQMqYIbWpfKcZwvSi0TH6oZjbqnwRvgfUUFEOp0qLZeJyzlfPQRWhfMB --rootDir ./src
npx clasp push
```

> Use `clasp clone` (não `clasp create`), já que o projeto Apps Script já existe — cuidado para não sobrescrever os arquivos locais em `src/` já implementados neste repositório; confirme o conteúdo antes de rodar `clasp push`.

## 3. Configurar Script Properties

O script detecta automaticamente a planilha ativa quando está **vinculado (bound)** a ela — ou seja, quando foi aberto a partir do menu **Extensões → Apps Script** dentro da própria planilha (é o seu caso). Nesse cenário, **não é preciso configurar `SPREADSHEET_ID`**.

`SPREADSHEET_ID` só é necessário se o script for standalone (criado separado, sem vínculo com uma planilha específica) — nesse caso, abra o projeto no editor (`npx clasp open`) → **Project Settings** → **Script Properties** e adicione:

| Propriedade | Valor | Quando é necessário |
|---|---|---|
| `SPREADSHEET_ID` | `1-H5lMr3q_u9M1CYaqMCikZZRtP3ke4yVtwj7tuatp-0` | Só se o script **não** estiver vinculado à planilha |
| `GITHUB_TOKEN` (opcional) | Personal Access Token do GitHub com escopo `repo` | Só para registrar repositórios **privados** |

## 4. Publicar como Web App

No editor (`npx clasp open` ou direto em script.google.com): **Deploy** → **New deployment** → tipo **Web app**:
- Execute as: **Me**
- Who has access: **Anyone within [seu domínio Google Workspace]**

Clique em **Deploy** e copie a URL gerada.

## 5. Validar

Antes de abrir o Web App, rode `verifySheetSchema` no editor do Apps Script (veja seção 1) e confirme `OK` no log.

Abra a URL do Web App e confirme:
- O banner com sprites animados carrega no topo.
- A busca e os filtros aparecem (ainda sem skills cadastradas).
- Cadastre um repositório público de teste e confirme que o card aparece e a linha foi criada na aba `Skills_Catalog`.

Veja o plano completo de verificação no PR/plano de implementação do projeto.
