# Codex Munin — Catálogo de Skills do Odin

Aplicação interna em **Google Apps Script + Google Sheets**, com estética pixel art retrô, que dá visibilidade às skills de IA desenvolvidas internamente ("Odin") e às curadas da comunidade — sem hospedar o código, que continua no GitHub.

## O que o MVP faz

- Cards de skills com nome, autor, resumo, categoria, tags, download `.zip` e comandos `git clone` (Bash/PowerShell).
- Cadastro assistido: cole a URL de um repositório do GitHub e os metadados (nome, descrição, topics, branch) são extraídos automaticamente.
- Suporte a repositórios privados via token do GitHub (Script Property).
- Categorização por classe primária (Product & Upstream, Software Engineering, Debugging & Troubleshooting, Quality & Test Automation, DevOps & Release, Architecture & Workflows) + tags livres.
- Busca e filtros instantâneos (client-side).
- Banner animado em pixel art no topo da home.

Módulos futuros (fora deste MVP): Odin Archive, Oracle Weekly (curadoria de IA), Community Radar/Bounty Board, Prompt Lab, Sandbox, Tech Radar, Health Check.

## Setup

Veja o passo a passo completo em [`docs/SETUP.md`](docs/SETUP.md).

## Estrutura

```
src/
├── Code.gs              # doGet, include()
├── SheetService.gs      # leitura/escrita no Google Sheets
├── GithubService.gs     # integração com a API do GitHub
├── SkillController.gs   # fronteira pública (google.script.run)
├── Utils.gs             # parsing de URL, clone/zip, erros
├── Index.html           # shell da página
├── Banner.html          # partial do banner animado
├── SearchBar.html        # partial de busca/filtros
├── RegisterModal.html    # partial do modal de cadastro
├── Stylesheet.html       # CSS (pixel art)
├── Script.html           # JS do cliente
└── SpriteEngine.html     # animação do banner (canvas)
```

## Desenvolvimento

```bash
npm install
npx clasp login
npx clasp push
```
