# Setup — Codex Munin

Passos manuais para colocar o Codex Munin (MVP) no ar.

## 1. Criar a planilha (Google Sheets)

Crie uma nova planilha no Google Drive (ex: "Codex Munin - Skill Catalog DB") com duas abas:

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

Copie o **ID da planilha** a partir da URL (`.../spreadsheets/d/{ID}/edit`).

## 2. Instalar o clasp e criar o projeto Apps Script

```bash
npm install
npx clasp login
npx clasp create --type webapp --title "Codex Munin" --rootDir ./src
```

Isso gera um `.clasp.json` local (não versionado) com o `scriptId` do projeto.

## 3. Configurar Script Properties

Abra o projeto no editor (`npx clasp open`) → **Project Settings** → **Script Properties** e adicione:

| Propriedade | Valor |
|---|---|
| `SPREADSHEET_ID` | ID copiado no passo 1 |
| `GITHUB_TOKEN` (opcional) | Personal Access Token do GitHub com escopo `repo`, necessário apenas para registrar repositórios **privados** |

## 4. Enviar o código

```bash
npx clasp push
```

## 5. Publicar como Web App

No editor: **Deploy** → **New deployment** → tipo **Web app**:
- Execute as: **Me**
- Who has access: **Anyone within [seu domínio Google Workspace]**

Clique em **Deploy** e copie a URL gerada.

## 6. Validar

Abra a URL do Web App e confirme:
- O banner com sprites animados carrega no topo.
- A busca e os filtros aparecem (ainda sem skills cadastradas).
- Cadastre um repositório público de teste e confirme que o card aparece e a linha foi criada na aba `Skills_Catalog`.

Veja o plano completo de verificação no PR/plano de implementação do projeto.
