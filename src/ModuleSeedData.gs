/**
 * Codex Munin - seed de exemplos reais para os 7 modulos extras (Archive,
 * Oracle, Radar, Prompts, Fame, Board, AI Radar).
 *
 * Rode manualmente pelo editor do Apps Script (selecione "seedAllModules"
 * no dropdown de funcoes e clique em Run). E idempotente: pula qualquer
 * item cujo campo-chave (titulo/nome) ja exista na aba correspondente.
 */

function seedAllModules() {
  var results = {
    odinDocs: seedIfMissing_(ODIN_DOCS_SHEET, ODIN_DOCS_HEADERS, 'titulo', SEED_ODIN_DOCS, addOdinDoc),
    oracleWeekly: seedIfMissing_(ORACLE_WEEKLY_SHEET, ORACLE_WEEKLY_HEADERS, 'titulo', SEED_ORACLE_ITEMS, addOracleItem),
    communityRadar: seedIfMissing_(COMMUNITY_RADAR_SHEET, COMMUNITY_RADAR_HEADERS, 'nome_ferramenta', SEED_COMMUNITY_RADAR, suggestCommunityTool),
    goldenPrompts: seedIfMissing_(GOLDEN_PROMPTS_SHEET, GOLDEN_PROMPTS_HEADERS, 'titulo', SEED_GOLDEN_PROMPTS, addGoldenPrompt),
    wallOfFame: seedIfMissing_(WALL_OF_FAME_SHEET, WALL_OF_FAME_HEADERS, 'skill_nome', SEED_WALL_OF_FAME, addWallOfFameEntry),
    requestBoard: seedIfMissing_(REQUEST_BOARD_SHEET, REQUEST_BOARD_HEADERS, 'titulo', SEED_REQUEST_BOARD, addRequestBoardItem),
    aiRadar: seedIfMissing_(AI_RADAR_SHEET, AI_RADAR_HEADERS, 'nome', SEED_AI_RADAR, addAiRadarItem)
  };
  Logger.log('seedAllModules: ' + JSON.stringify(results));
  return results;
}

/**
 * @param {string} sheetName
 * @param {Array<string>} headers
 * @param {string} keyField campo usado para checar duplicidade.
 * @param {Array<Object>} seedItems
 * @param {Function} addFn funcao addX(payload) do modulo, ja retorna {success, data|message}.
 * @return {{added: number, skipped: number}}
 * @private
 */
function seedIfMissing_(sheetName, headers, keyField, seedItems, addFn) {
  var existing = readAllRows_(sheetName, headers).map(function (row) { return row[keyField]; });
  var added = 0;
  var skipped = 0;
  seedItems.forEach(function (item) {
    if (existing.indexOf(item[keyField]) !== -1) {
      skipped++;
      return;
    }
    var result = addFn(item);
    if (result.success) {
      added++;
    } else {
      Logger.log('seedIfMissing_(' + sheetName + '): falhou em "' + item[keyField] + '": ' + result.message);
    }
  });
  return { added: added, skipped: skipped };
}

var SEED_ODIN_DOCS = [
  {
    titulo: 'Guia de Onboarding de Engenharia',
    categoria: 'Software Engineering',
    conteudo_url: 'https://docs.google.com/document/d/1exampleOnboardingDoc/edit',
    resumo: 'Passo a passo para novos engenheiros configurarem ambiente, acessos e primeiras entregas.'
  },
  {
    titulo: 'Runbook de Incidentes de Producao',
    categoria: 'DevOps & Release',
    conteudo_url: 'https://docs.google.com/document/d/1exampleIncidentRunbook/edit',
    resumo: 'Fluxo de resposta a incidentes: triagem, comunicacao, escalonamento e postmortem.'
  },
  {
    titulo: 'Padroes de Code Review',
    categoria: 'Quality & Test Automation',
    conteudo_url: 'https://docs.google.com/document/d/1exampleCodeReviewStandards/edit',
    resumo: 'Checklist e expectativas de qualidade para revisao de pull requests no time.'
  },
  {
    titulo: 'Arquitetura de Referencia - Integracoes Salesforce',
    categoria: 'Architecture & Workflows',
    conteudo_url: 'https://docs.google.com/document/d/1exampleSalesforceArch/edit',
    resumo: 'Diagrama e decisoes de design para integracoes entre Salesforce e sistemas externos.'
  }
];

var SEED_ORACLE_ITEMS = [
  {
    titulo: 'Anthropic lanca Claude Agent SDK',
    url: 'https://www.anthropic.com/news/claude-agent-sdk',
    fonte: 'Anthropic Blog',
    resumo: 'SDK oficial para construir agentes customizados sobre o Claude Code, com ferramentas e permissoes configuraveis.'
  },
  {
    titulo: 'Google lanca Gemini 2.0 Flash',
    url: 'https://blog.google/technology/google-deepmind/gemini-model-updates-february-2025/',
    fonte: 'Google Blog',
    resumo: 'Novo modelo multimodal com foco em velocidade e custo, indicado para automacoes de alto volume.'
  },
  {
    titulo: 'Como times de plataforma estao adotando IA agentica',
    url: 'https://martinfowler.com/articles/exploring-gen-ai.html',
    fonte: 'Martin Fowler',
    resumo: 'Serie de artigos sobre padroes emergentes de uso de LLMs em times de engenharia de plataforma.'
  }
];

var SEED_COMMUNITY_RADAR = [
  {
    nome_ferramenta: 'Biome',
    url: 'https://github.com/biomejs/biome',
    descricao: 'Formatter + linter unico e rapido para JS/TS, alternativa ao ESLint+Prettier.'
  },
  {
    nome_ferramenta: 'Bun',
    url: 'https://github.com/oven-sh/bun',
    descricao: 'Runtime JS/TS all-in-one (bundler, test runner, package manager) com foco em performance.'
  },
  {
    nome_ferramenta: 'Zed',
    url: 'https://github.com/zed-industries/zed',
    descricao: 'Editor de codigo colaborativo e de alta performance, com IA integrada nativamente.'
  }
];

var SEED_GOLDEN_PROMPTS = [
  {
    titulo: 'Revisor de Pull Request',
    prompt_texto: 'Revise o diff abaixo como um engenheiro senior focado em {{linguagem}}. Aponte bugs, riscos de seguranca e sugestoes de simplificacao, sem reescrever o codigo inteiro.\n\nDiff:\n{{diff}}',
    variaveis: 'linguagem, diff',
    categoria: 'Quality & Test Automation'
  },
  {
    titulo: 'Gerador de Resumo de Incidente',
    prompt_texto: 'Com base no log de eventos abaixo, escreva um resumo de incidente em ate 5 frases, incluindo causa raiz provavel e proximos passos.\n\nLog:\n{{log}}',
    variaveis: 'log',
    categoria: 'DevOps & Release'
  },
  {
    titulo: 'Explicador de Arquitetura Legada',
    prompt_texto: 'Explique o proposito e o fluxo de dados do modulo {{nome_modulo}} a partir do codigo abaixo, como se estivesse documentando para um novo integrante do time.\n\nCodigo:\n{{codigo}}',
    variaveis: 'nome_modulo, codigo',
    categoria: 'Architecture & Workflows'
  }
];

var SEED_WALL_OF_FAME = [
  {
    skill_nome: 'Salesforce_Deep_Debugger',
    time: 'Plataforma Salesforce',
    impacto: 'Reduziu em ~40% o tempo medio de diagnostico de bugs em producao no ultimo trimestre.'
  },
  {
    skill_nome: 'Salesforce_Apex-Cover-Loop',
    time: 'Qualidade',
    impacto: 'Elevou a cobertura media de testes Apex de 68% para 85% em 3 squads.'
  }
];

var SEED_REQUEST_BOARD = [
  {
    titulo: 'Skill de geracao automatica de changelog',
    descricao: 'Gerar changelog formatado a partir dos commits de um release, agrupando por tipo (feat/fix/chore).'
  },
  {
    titulo: 'Skill de auditoria de permissoes Salesforce',
    descricao: 'Varrer perfis e permission sets em busca de acessos excessivos ou nao utilizados.'
  }
];

var SEED_AI_RADAR = [
  { nome: 'Claude Code', quadrante: 'ADOPT', descricao: 'Em uso diario pelo time de engenharia para desenvolvimento assistido por IA.' },
  { nome: 'Gemini 2.0 Flash', quadrante: 'TRIAL', descricao: 'Em avaliacao para automacoes de alto volume e baixo custo.' },
  { nome: 'LangGraph', quadrante: 'ASSESS', descricao: 'Orquestracao de agentes multi-step; ainda sem caso de uso interno validado.' },
  { nome: 'AutoGPT (projeto original)', quadrante: 'HOLD', descricao: 'Abordagem de agente totalmente autonomo mostrou-se instavel para casos de producao.' }
];
