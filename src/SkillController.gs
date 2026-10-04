/**
 * Codex Munin - fronteira publica chamada pelo cliente via google.script.run.
 * Toda funcao aqui retorna {success, data?, errorCode?, message?} em vez de lancar,
 * para o cliente tratar erros de forma uniforme.
 */

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getSkills() {
  try {
    return { success: true, data: getAllSkills() };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @return {{success: boolean, data?: Array<string>, message?: string}}
 */
function getCategoriasList() {
  try {
    return { success: true, data: getCategorias() };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * Busca metadados do GitHub para pre-preencher o formulario de cadastro.
 * Ja devolve zipUrl/cloneCommands computados, para o cliente nunca precisar
 * reimplementar essa formula (evita divergencia entre preview e card final).
 * @param {string} repoUrl
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function previewGithubRepo(repoUrl) {
  try {
    var metadata = fetchGithubRepoMetadata(repoUrl);
    var computed = computeRepoArtifacts_(metadata);
    return {
      success: true,
      data: Object.assign({}, metadata, {
        zipUrl: computed.zipUrl,
        cloneCommands: computed.cloneCommands
      })
    };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * Registra uma nova skill a partir de uma URL do GitHub. Re-busca os metadados
 * no servidor (nao confia em zip/clone URLs vindas do cliente).
 * @param {{repoUrl: string, tipo: string, categoria: string, tags: string,
 *   resumoOverride?: string, nomeOverride?: string}} formPayload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function registerSkillFromGithub(formPayload) {
  try {
    if (!formPayload || !formPayload.repoUrl) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'URL do repositorio e obrigatoria.');
    }
    if (!formPayload.tipo || !formPayload.categoria) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Tipo e categoria sao obrigatorios.');
    }

    var metadata = fetchGithubRepoMetadata(formPayload.repoUrl);
    var computed = computeRepoArtifacts_(metadata);
    var zipUrl = computed.zipUrl;
    var cloneCommands = computed.cloneCommands;

    var skillObject = {
      nome: formPayload.nomeOverride || metadata.name,
      tipo: formPayload.tipo,
      autor: metadata.owner,
      resumo: formPayload.resumoOverride || metadata.description || 'Sem descricao informada.',
      categoria_primaria: formPayload.categoria,
      tags: formPayload.tags || metadata.topics.join(', '),
      repo_url: formPayload.repoUrl,
      owner: metadata.owner,
      repo_name: metadata.repo,
      default_branch: metadata.defaultBranch,
      zip_url: zipUrl,
      clone_bash: cloneCommands.bash,
      clone_powershell: cloneCommands.powershell
    };

    var saved = appendSkillRow(skillObject);
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * Computa zipUrl e cloneCommands a partir de metadados ja buscados do GitHub.
 * Unico ponto de calculo, reutilizado por previewGithubRepo e registerSkillFromGithub
 * para que a previa do modal nunca divirja do que e efetivamente salvo.
 * @param {{owner: string, repo: string, defaultBranch: string}} metadata
 * @return {{zipUrl: string, cloneCommands: {bash: string, powershell: string}}}
 * @private
 */
function computeRepoArtifacts_(metadata) {
  return {
    zipUrl: buildZipUrl(metadata.owner, metadata.repo, metadata.defaultBranch),
    cloneCommands: buildCloneCommands(metadata.owner, metadata.repo)
  };
}

/**
 * Normaliza qualquer erro (SkillCatalogError ou generico) para o contrato de resposta.
 * @param {Error} err
 * @return {{success: boolean, errorCode: string, message: string}}
 * @private
 */
function toErrorResult_(err) {
  if (err instanceof SkillCatalogError) {
    return { success: false, errorCode: err.code, message: err.message };
  }
  return { success: false, errorCode: 'UNKNOWN_ERROR', message: err.message || String(err) };
}
