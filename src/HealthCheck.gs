/**
 * Codex Munin - Health Check: verificacao periodica de "saude" de cada skill
 * cadastrada, com indicador verde/amarelo/vermelho baseado em ha quanto tempo
 * o repositorio foi tocado pela ultima vez no GitHub.
 *
 * Rode installHealthCheckTrigger() uma vez (pelo editor do Apps Script) para
 * criar o gatilho semanal; checkSkillsHealth() tambem pode ser rodado manualmente.
 */
var HEALTH_STATUS_GREEN = 'VERDE';
var HEALTH_STATUS_YELLOW = 'AMARELO';
var HEALTH_STATUS_RED = 'VERMELHO';

/**
 * Verifica a data do ultimo push de cada skill ativa no GitHub e atualiza a
 * coluna status_saude na planilha: VERDE (<90 dias), AMARELO (90-180 dias),
 * VERMELHO (>180 dias ou repo inacessivel).
 * @return {{updated: number, errors: Array<string>}}
 */
function checkSkillsHealth() {
  var sheet = getSkillsSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var ownerCol = headers.indexOf('owner');
  var repoCol = headers.indexOf('repo_name');
  var statusCol = headers.indexOf('status_saude');
  var ativoCol = headers.indexOf('ativo');

  if (statusCol === -1) {
    throw new SkillCatalogError('MISSING_COLUMN', 'Coluna status_saude nao existe. Rode setupSpreadsheet() primeiro.');
  }

  var updated = 0;
  var errors = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[ativoCol] !== true && row[ativoCol] !== 'TRUE') continue;

    try {
      var pushedAt = fetchGithubLastPush_(row[ownerCol], row[repoCol]);
      var daysSincePush = (Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);
      var status = daysSincePush < 90 ? HEALTH_STATUS_GREEN :
        daysSincePush < 180 ? HEALTH_STATUS_YELLOW : HEALTH_STATUS_RED;
      sheet.getRange(i + 1, statusCol + 1).setValue(status);
      updated++;
    } catch (err) {
      sheet.getRange(i + 1, statusCol + 1).setValue(HEALTH_STATUS_RED);
      errors.push(row[ownerCol] + '/' + row[repoCol] + ': ' + err.message);
    }
  }

  Logger.log('checkSkillsHealth: ' + updated + ' skill(s) atualizadas, ' + errors.length + ' erro(s).');
  return { updated: updated, errors: errors };
}

/**
 * @param {string} owner
 * @param {string} repo
 * @return {string} data ISO do ultimo push.
 * @private
 */
function fetchGithubLastPush_(owner, repo) {
  var url = 'https://api.github.com/repos/' + owner + '/' + repo;
  var headers = { 'Accept': 'application/vnd.github+json' };
  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (token) headers['Authorization'] = 'Bearer ' + token;

  var response = UrlFetchApp.fetch(url, { headers: headers, muteHttpExceptions: true });
  if (response.getResponseCode() >= 400) {
    throw new Error('GitHub respondeu ' + response.getResponseCode());
  }
  return JSON.parse(response.getContentText()).pushed_at;
}

/**
 * Cria o gatilho semanal que roda checkSkillsHealth() automaticamente.
 * Idempotente: remove gatilhos anteriores desta funcao antes de criar um novo.
 */
function installHealthCheckTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'checkSkillsHealth') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger('checkSkillsHealth').timeBased().everyWeeks(1).create();
  Logger.log('installHealthCheckTrigger: gatilho semanal criado para checkSkillsHealth().');
}
