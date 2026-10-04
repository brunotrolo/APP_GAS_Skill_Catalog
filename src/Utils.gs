/**
 * Codex Munin - utilitarios de parsing, URLs de clone/zip e erro tipado.
 */

/**
 * Erro tipado usado por GithubService e SkillController.
 * @param {string} code
 * @param {string} message
 */
function SkillCatalogError(code, message) {
  this.name = 'SkillCatalogError';
  this.code = code;
  this.message = message;
}
SkillCatalogError.prototype = Object.create(Error.prototype);
SkillCatalogError.prototype.constructor = SkillCatalogError;

/**
 * Extrai owner/repo de uma URL do GitHub.
 * Aceita https://github.com/owner/repo, com/sem .git, com/sem barra final,
 * e formato SSH git@github.com:owner/repo.git.
 * @param {string} url
 * @return {{owner: string, repo: string}}
 */
function extractGithubRepo(url) {
  if (!url || typeof url !== 'string') {
    throw new SkillCatalogError('INVALID_URL', 'URL do repositorio nao informada.');
  }

  var trimmed = url.trim();
  var patterns = [
    /github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?\/?$/i
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = trimmed.match(patterns[i]);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  throw new SkillCatalogError(
    'INVALID_URL',
    'Essa URL nao parece ser de um repositorio do GitHub. Formato esperado: https://github.com/owner/repo'
  );
}

/**
 * Monta os comandos de git clone para Bash e PowerShell.
 * @param {string} owner
 * @param {string} repo
 * @return {{bash: string, powershell: string}}
 */
function buildCloneCommands(owner, repo) {
  var httpsUrl = 'https://github.com/' + owner + '/' + repo + '.git';
  return {
    bash: 'git clone ' + httpsUrl,
    powershell: 'git clone ' + httpsUrl
  };
}

/**
 * Monta a URL do zip do branch padrao.
 * @param {string} owner
 * @param {string} repo
 * @param {string} branch
 * @return {string}
 */
function buildZipUrl(owner, repo, branch) {
  return 'https://github.com/' + owner + '/' + repo + '/archive/refs/heads/' + branch + '.zip';
}
