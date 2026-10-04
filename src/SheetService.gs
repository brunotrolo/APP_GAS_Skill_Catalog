/**
 * Codex Munin - acesso a planilha (Google Sheets) usada como banco de dados.
 */

var SKILLS_SHEET_NAME = 'Skills_Catalog';
var CATEGORIAS_SHEET_NAME = 'Categorias';

var SKILLS_HEADERS = [
  'id', 'nome', 'tipo', 'autor', 'resumo', 'categoria_primaria', 'tags',
  'repo_url', 'owner', 'repo_name', 'default_branch', 'zip_url',
  'clone_bash', 'clone_powershell', 'data_registro', 'registrado_por', 'ativo',
  'clones'
];

/**
 * Resolve a planilha. Se o script estiver vinculado (bound) a uma planilha
 * (aberto via Extensoes > Apps Script), usa a planilha ativa automaticamente.
 * Caso contrario (script standalone), exige a Script Property SPREADSHEET_ID.
 * @return {GoogleAppsScript.Spreadsheet.Spreadsheet}
 * @private
 */
function getSpreadsheet_() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) {
    return activeSpreadsheet;
  }

  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new SkillCatalogError(
      'MISSING_SPREADSHEET_ID',
      'Script nao esta vinculado a uma planilha e a Script Property SPREADSHEET_ID nao foi configurada.'
    );
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

/**
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 * @private
 */
function getSkillsSheet_() {
  var sheet = getSpreadsheet_().getSheetByName(SKILLS_SHEET_NAME);
  if (!sheet) {
    throw new SkillCatalogError('MISSING_SHEET', 'Aba ' + SKILLS_SHEET_NAME + ' nao encontrada.');
  }
  return sheet;
}

/**
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 * @private
 */
function getCategoriasSheet_() {
  var sheet = getSpreadsheet_().getSheetByName(CATEGORIAS_SHEET_NAME);
  if (!sheet) {
    throw new SkillCatalogError('MISSING_SHEET', 'Aba ' + CATEGORIAS_SHEET_NAME + ' nao encontrada.');
  }
  return sheet;
}

/**
 * Converte uma linha (array) em objeto, usando os headers da planilha.
 * @param {Array<string>} headers
 * @param {Array} row
 * @return {Object}
 * @private
 */
function rowToObject_(headers, row) {
  var obj = {};
  headers.forEach(function (header, index) {
    obj[header] = row[index];
  });
  return obj;
}

/**
 * Converte um objeto de skill em array respeitando a ordem de SKILLS_HEADERS.
 * @param {Object} obj
 * @return {Array}
 * @private
 */
function objectToRow_(obj) {
  return SKILLS_HEADERS.map(function (header) {
    return obj[header] !== undefined && obj[header] !== null ? obj[header] : '';
  });
}

/**
 * Retorna todas as skills ativas cadastradas.
 * @return {Array<Object>}
 */
function getAllSkills() {
  var sheet = getSkillsSheet_();
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return [];
  }

  var headers = values.shift();
  return values
    .map(function (row) {
      return rowToObject_(headers, row);
    })
    .filter(function (skill) {
      return skill.ativo === true || skill.ativo === 'TRUE';
    });
}

/**
 * Retorna a lista de categorias controladas.
 * @return {Array<string>}
 */
function getCategorias() {
  var sheet = getCategoriasSheet_();
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return [];
  }
  values.shift();
  return values
    .map(function (row) {
      return row[0];
    })
    .filter(function (categoria) {
      return categoria !== '' && categoria !== null && categoria !== undefined;
    });
}

/**
 * Adiciona uma nova linha de skill na planilha.
 * @param {Object} skillObject objeto com as chaves de SKILLS_HEADERS (id/data/ativo
 *   sao preenchidos aqui se ausentes).
 * @return {Object} o objeto efetivamente salvo.
 */
function appendSkillRow(skillObject) {
  var sheet = getSkillsSheet_();

  var completeSkill = Object.assign({}, skillObject);
  completeSkill.id = completeSkill.id || Utilities.getUuid();
  completeSkill.data_registro = completeSkill.data_registro || new Date().toISOString();
  completeSkill.registrado_por = completeSkill.registrado_por || Session.getActiveUser().getEmail();
  completeSkill.ativo = completeSkill.ativo === undefined ? true : completeSkill.ativo;
  completeSkill.clones = completeSkill.clones || 0;

  sheet.appendRow(objectToRow_(completeSkill));
  return completeSkill;
}

/**
 * Incrementa o contador de clones/downloads de uma skill em 1.
 * @param {string} id
 * @return {number} o novo valor do contador.
 */
function incrementSkillClones(id) {
  var sheet = getSkillsSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idCol = headers.indexOf('id');
  var clonesCol = headers.indexOf('clones');

  for (var i = 1; i < values.length; i++) {
    if (values[i][idCol] === id) {
      var current = Number(values[i][clonesCol]) || 0;
      var updated = current + 1;
      sheet.getRange(i + 1, clonesCol + 1).setValue(updated);
      return updated;
    }
  }

  throw new SkillCatalogError('NOT_FOUND', 'Skill nao encontrada: ' + id);
}
