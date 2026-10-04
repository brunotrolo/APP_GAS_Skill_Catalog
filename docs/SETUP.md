# Setup — Codex Munin

Passos manuais para colocar o Codex Munin (MVP) no ar.

> **Status atual**: a planilha e o projeto Apps Script já foram criados manualmente pelo usuário:
> - Google Sheets: `1-H5lMr3q_u9M1CYaqMCikZZRtP3ke4yVtwj7tuatp-0`
> - Apps Script: `1vQMqYIbWpfKcZwvSi0TH6oZjbqnwRvgfUUFEOp0qLZeJyzlfPQRWhfMB`
>
> **Ainda não implantado/deployado** — siga os passos abaixo para configurar as abas, fazer o `clasp push` e só então decidir quando publicar como Web App.

## 1. Preparar a planilha (Google Sheets)

Na planilha já criada, adicione duas abas:

### Aba `Skills_Catalog`
Cabeçalho na linha 1 (nessa ordem exata):

```
id | nome | tipo | autor | resumo | categoria_primaria | tags | repo_url | owner | repo_name | default_branch | zip_url | clone_bash | clone_powershell | data_registro | registrado_por | ativo
```

Pode ficar vazia — as linhas serão preenchidas pelo app.

### Aba `Categorias`
Cabeçalho `categoria` na linha 1, seguido das linhas:

```
Product & Upstream
Software Engineering
Debugging & Troubleshooting
Quality & Test Automation
DevOps & Release
Architecture & Workflows
```

## 2. Instalar o clasp e conectar ao projeto Apps Script existente

```bash
npm install
npx clasp login
npx clasp clone 1vQMqYIbWpfKcZwvSi0TH6oZjbqnwRvgfUUFEOp0qLZeJyzlfPQRWhfMB --rootDir ./src
```

> Como o projeto Apps Script já existe, use `clasp clone` (não `clasp create`) para não criar um segundo script. Isso gera um `.clasp.json` local (não versionado) apontando para o `scriptId` acima — cuidado para não sobrescrever os arquivos locais em `src/` já implementados neste repositório; confirme o conteúdo antes de rodar `clasp push`.

## 3. Configurar Script Properties

Abra o projeto no editor (`npx clasp open`) → **Project Settings** → **Script Properties** e adicione:

| Propriedade | Valor |
|---|---|
| `SPREADSHEET_ID` | `1-H5lMr3q_u9M1CYaqMCikZZRtP3ke4yVtwj7tuatp-0` |
| `GITHUB_TOKEN` (opcional) | Personal Access Token do GitHub com escopo `repo`, necessário apenas para registrar repositórios **privados** |

## 4. Enviar o código

```bash
npx clasp push
```

## 5. Publicar como Web App (aguardar sinal verde)

> ⚠️ Não publicar ainda — aguardar confirmação explícita antes de fazer o deploy, mesmo após `clasp push`.

Quando autorizado, no editor: **Deploy** → **New deployment** → tipo **Web app**:
- Execute as: **Me**
- Who has access: **Anyone within [seu domínio Google Workspace]**

Clique em **Deploy** e copie a URL gerada.

## 6. Validar

Abra a URL do Web App e confirme:
- O banner com sprites animados carrega no topo.
- A busca e os filtros aparecem (ainda sem skills cadastradas).
- Cadastre um repositório público de teste e confirme que o card aparece e a linha foi criada na aba `Skills_Catalog`.

Veja o plano completo de verificação no PR/plano de implementação do projeto.
