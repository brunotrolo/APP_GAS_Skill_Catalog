/**
 * Codex Munin - utilitario interno de CRUD sobre abas simples (lista de objetos).
 * Usado pelos modulos extras (Archive, Oracle, Radar, Prompts, etc.) para nao
 * duplicar leitura/escrita de linhas; cada modulo mantem seu proprio arquivo
 * de servico/controller e pagina, so a mecanica de planilha e compartilhada.
 */

/**
 * Garante que uma aba existe com os headers esperados (cria se faltar).
 * @param {string} sheetName
 * @param {Array<string>} headers
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 * @private
 */
function ensureSheet_(sheetName, headers) {
  var spreadsheet = getSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Le todas as linhas de uma aba simples como array de objetos.
 * @param {string} sheetName
 * @param {Array<string>} headers
 * @return {Array<Object>}
 * @private
 */
function readAllRows_(sheetName, headers) {
  var sheet = ensureSheet_(sheetName, headers);
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  var actualHeaders = values.shift();
  return values.map(function (row) {
    var obj = {};
    actualHeaders.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

/**
 * Adiciona uma linha a uma aba simples. Preenche id/data automaticamente se ausentes.
 * @param {string} sheetName
 * @param {Array<string>} headers
 * @param {Object} obj
 * @return {Object} objeto efetivamente salvo.
 * @private
 */
function appendRow_(sheetName, headers, obj) {
  var sheet = ensureSheet_(sheetName, headers);
  var complete = Object.assign({}, obj);
  complete.id = complete.id || Utilities.getUuid();
  if (headers.indexOf('data') !== -1) {
    complete.data = complete.data || new Date().toISOString();
  }
  var row = headers.map(function (h) {
    return complete[h] !== undefined && complete[h] !== null ? complete[h] : '';
  });
  sheet.appendRow(row);
  return complete;
}

/**
 * Incrementa um campo numerico (ex: votos) de uma linha identificada por id.
 * @param {string} sheetName
 * @param {Array<string>} headers
 * @param {string} id
 * @param {string} field
 * @return {number} novo valor.
 * @private
 */
function incrementField_(sheetName, headers, id, field) {
  var sheet = ensureSheet_(sheetName, headers);
  var values = sheet.getDataRange().getValues();
  var actualHeaders = values[0];
  var idCol = actualHeaders.indexOf('id');
  var fieldCol = actualHeaders.indexOf(field);
  for (var i = 1; i < values.length; i++) {
    if (values[i][idCol] === id) {
      var updated = (Number(values[i][fieldCol]) || 0) + 1;
      sheet.getRange(i + 1, fieldCol + 1).setValue(updated);
      return updated;
    }
  }
  throw new SkillCatalogError('NOT_FOUND', 'Registro nao encontrado: ' + id);
}
