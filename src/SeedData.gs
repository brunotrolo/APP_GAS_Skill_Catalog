/**
 * Codex Munin - seed em lote de skills a partir do GitHub (para popular a
 * planilha com dados de teste). Reaproveita fetchGithubRepoMetadata
 * (GithubService.gs), computeRepoArtifacts_ (SkillController.gs) e
 * appendSkillRow (SheetService.gs) - a mesma logica usada pelo cadastro
 * manual via modal, so que disparada em lote direto do editor.
 *
 * Rode manualmente pelo editor do Apps Script (selecione "seedSkillsFromGithub"
 * no dropdown de funcoes e clique em Run). E idempotente: pula qualquer
 * repo_url que ja exista na planilha.
 */

var SEED_REPOS = [
  // --- Skills internas (repos publicos do usuario) ---
  { url: 'https://github.com/brunotrolo/Salesforce_Journey_Designer', tipo: 'INTERNA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/brunotrolo/Salesforce_Deep_Debugger', tipo: 'INTERNA', categoria: 'Debugging & Troubleshooting' },
  { url: 'https://github.com/brunotrolo/Salesforce_Journey_Developer', tipo: 'INTERNA', categoria: 'Software Engineering' },
  { url: 'https://github.com/brunotrolo/Salesforce_Archaeologist', tipo: 'INTERNA', categoria: 'Debugging & Troubleshooting' },
  { url: 'https://github.com/brunotrolo/Salesforce_Apex-Cover-Loop', tipo: 'INTERNA', categoria: 'Quality & Test Automation' },
  { url: 'https://github.com/brunotrolo/APP_GAS_StockOps', tipo: 'INTERNA', categoria: 'Software Engineering' },
  { url: 'https://github.com/brunotrolo/Salesforce_LWC-Developer', tipo: 'INTERNA', categoria: 'Software Engineering' },
  { url: 'https://github.com/brunotrolo/Salesforce_Apex_Callouts_Developer', tipo: 'INTERNA', categoria: 'Software Engineering' },

  // --- Skills de curadoria (repos que o usuario deu star) ---
  { url: 'https://github.com/shanraisshan/claude-code-best-practice', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/ComposioHQ/awesome-claude-skills', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/Egonex-AI/Understand-Anything', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/ricneves-ai/flowgrammers-skills', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/alirezarezvani/claude-skills', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/garrytan/gstack', tipo: 'CURADORIA', categoria: 'DevOps & Release' },
  { url: 'https://github.com/phuryn/pm-skills', tipo: 'CURADORIA', categoria: 'Product & Upstream' },
  { url: 'https://github.com/VoltAgent/awesome-claude-code-subagents', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/msitarzewski/agency-agents', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/melgarafael/DeskcommCRM', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/tt-a1i/archify', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/supermemoryai/supermemory', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/salesforce-ux/design-system-2-starter-kit', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/multica-ai/andrej-karpathy-skills', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/pixel-agents-hq/pixel-agents', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/deepseek-ai/deepseek-harness', tipo: 'CURADORIA', categoria: 'DevOps & Release' },
  { url: 'https://github.com/mattpocock/skills', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/addyosmani/agent-skills', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/github/spec-kit', tipo: 'CURADORIA', categoria: 'Product & Upstream' },
  { url: 'https://github.com/pbakaus/impeccable', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/kepano/obsidian-skills', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/oso95/scroll-world', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/obra/superpowers', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' },
  { url: 'https://github.com/ayghri/i-have-adhd', tipo: 'CURADORIA', categoria: 'Software Engineering' },
  { url: 'https://github.com/VoltAgent/awesome-design-md', tipo: 'CURADORIA', categoria: 'Architecture & Workflows' }
];

/**
 * Registra todos os repos de SEED_REPOS que ainda nao estiverem na planilha.
 * Reaproveita a mesma logica de fetchGithubRepoMetadata + computeRepoArtifacts_
 * + appendSkillRow usada pelo cadastro via modal.
 * @return {{added: Array<string>, skipped: Array<string>, errors: Array<string>}}
 */
function seedSkillsFromGithub() {
  var existingUrls = getAllSkills().map(function (skill) { return skill.repo_url; });
  var result = { added: [], skipped: [], errors: [] };

  SEED_REPOS.forEach(function (entry) {
    if (existingUrls.indexOf(entry.url) !== -1) {
      result.skipped.push(entry.url);
      return;
    }

    try {
      var metadata = fetchGithubRepoMetadata(entry.url);
      var computed = computeRepoArtifacts_(metadata);

      appendSkillRow({
        nome: metadata.name,
        tipo: entry.tipo,
        autor: metadata.owner,
        resumo: metadata.description || 'Sem descricao informada.',
        categoria_primaria: entry.categoria,
        tags: metadata.topics.join(', '),
        repo_url: entry.url,
        owner: metadata.owner,
        repo_name: metadata.repo,
        default_branch: metadata.defaultBranch,
        zip_url: computed.zipUrl,
        clone_bash: computed.cloneCommands.bash,
        clone_powershell: computed.cloneCommands.powershell
      });

      result.added.push(entry.url);
      Utilities.sleep(250);
    } catch (err) {
      result.errors.push(entry.url + ': ' + (err.message || err));
    }
  });

  Logger.log(
    'seedSkillsFromGithub: ' + result.added.length + ' adicionadas, ' +
    result.skipped.length + ' ja existiam, ' + result.errors.length + ' erros.'
  );
  if (result.errors.length > 0) {
    Logger.log('Erros:');
    result.errors.forEach(function (e) { Logger.log('- ' + e); });
  }

  return result;
}
