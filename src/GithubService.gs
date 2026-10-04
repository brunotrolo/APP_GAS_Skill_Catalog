/**
 * Codex Munin - integracao com a API do GitHub.
 */

/**
 * Busca metadados de um repositorio do GitHub a partir da URL colada pelo usuario.
 * @param {string} repoUrl
 * @return {{owner: string, repo: string, name: string, description: string,
 *   topics: Array<string>, defaultBranch: string}}
 */
function fetchGithubRepoMetadata(repoUrl) {
  var parsed = extractGithubRepo(repoUrl);
  var apiUrl = 'https://api.github.com/repos/' + parsed.owner + '/' + parsed.repo;

  var headers = {
    'User-Agent': 'Codex-Munin-App',
    'Accept': 'application/vnd.github+json'
  };

  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  var hasToken = !!token;
  if (hasToken) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  var response = UrlFetchApp.fetch(apiUrl, {
    headers: headers,
    muteHttpExceptions: true
  });

  var code = response.getResponseCode();

  if (code === 200) {
    var data = JSON.parse(response.getContentText());
    return {
      owner: data.owner && data.owner.login ? data.owner.login : parsed.owner,
      repo: parsed.repo,
      name: data.name || parsed.repo,
      description: data.description || '',
      topics: data.topics || [],
      defaultBranch: data.default_branch || 'main'
    };
  }

  if (code === 404) {
    var hint = hasToken
      ? 'Repositorio nao encontrado. Verifique o nome do repositorio.'
      : 'Repositorio nao encontrado ou privado. Se for privado, configure GITHUB_TOKEN.';
    throw new SkillCatalogError('PRIVATE_OR_NOT_FOUND', hint);
  }

  var rateLimitRemaining = response.getHeaders()['x-ratelimit-remaining'] || response.getHeaders()['X-RateLimit-Remaining'];
  if ((code === 403 || code === 429) && rateLimitRemaining === '0') {
    var resetHeader = response.getHeaders()['x-ratelimit-reset'] || response.getHeaders()['X-RateLimit-Reset'];
    var resetMessage = resetHeader
      ? ' Tente novamente apos ' + new Date(Number(resetHeader) * 1000).toLocaleTimeString()
      : '';
    throw new SkillCatalogError('RATE_LIMITED', 'Limite de requisicoes do GitHub atingido.' + resetMessage);
  }

  if (code === 403) {
    throw new SkillCatalogError(
      'PRIVATE_REPO_NO_ACCESS',
      'Sem acesso a este repositorio privado. Verifique o GITHUB_TOKEN configurado.'
    );
  }

  throw new SkillCatalogError('GITHUB_API_ERROR', 'Erro inesperado ao consultar o GitHub (codigo ' + code + ').');
}
