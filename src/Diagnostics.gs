/**
 * Codex Munin - setup e diagnostico de schema da planilha.
 * Rode manualmente pelo editor do Apps Script (selecione a funcao no dropdown
 * ao lado do botao Run e clique em Run):
 *   - setupSpreadsheet(): cria as abas/colunas que faltarem (idempotente).
 *   - verifySheetSchema(): so confere, nao altera nada.
 */

var CATEGORIAS_SEED = [
  'Product & Upstream',
  'Software Engineering',
  'Debugging & Troubleshooting',
  'Quality & Test Automation',
  'DevOps & Release',
  'Architecture & Workflows'
];

/**
 * Cria as abas Skills_Catalog e Categorias com os headers/seed esperados,
 * caso ainda nao existam. Idempotente: nao duplica nem apaga dados se as
 * abas ja existirem com conteudo.
 * @return {{created: Array<string>, alreadyExisted: Array<string>}}
 */
function setupSpreadsheet() {
  var spreadsheet = getSpreadsheet_();
  var created = [];
  var alreadyExisted = [];

  var skillsSheet = spreadsheet.getSheetByName(SKILLS_SHEET_NAME);
  if (!skillsSheet) {
    skillsSheet = spreadsheet.insertSheet(SKILLS_SHEET_NAME);
    skillsSheet.getRange(1, 1, 1, SKILLS_HEADERS.length).setValues([SKILLS_HEADERS]);
    skillsSheet.setFrozenRows(1);
    created.push(SKILLS_SHEET_NAME);
  } else {
    alreadyExisted.push(SKILLS_SHEET_NAME);
    var existingHeaders = skillsSheet.getRange(1, 1, 1, Math.max(skillsSheet.getLastColumn(), 1)).getValues()[0];
    if (existingHeaders.indexOf('clones') === -1) {
      var nextCol = skillsSheet.getLastColumn() + 1;
      skillsSheet.getRange(1, nextCol).setValue('clones');
      Logger.log('setupSpreadsheet: coluna "clones" adicionada em ' + SKILLS_SHEET_NAME + '.');
    }
  }

  var categoriasSheet = spreadsheet.getSheetByName(CATEGORIAS_SHEET_NAME);
  if (!categoriasSheet) {
    categoriasSheet = spreadsheet.insertSheet(CATEGORIAS_SHEET_NAME);
    categoriasSheet.getRange(1, 1).setValue('categoria');
    categoriasSheet.getRange(2, 1, CATEGORIAS_SEED.length, 1).setValues(
      CATEGORIAS_SEED.map(function (categoria) { return [categoria]; })
    );
    categoriasSheet.setFrozenRows(1);
    created.push(CATEGORIAS_SHEET_NAME);
  } else {
    alreadyExisted.push(CATEGORIAS_SHEET_NAME);
  }

  var result = { created: created, alreadyExisted: alreadyExisted };
  Logger.log(
    'setupSpreadsheet: criadas [' + created.join(', ') + '], ja existiam [' + alreadyExisted.join(', ') + ']'
  );
  if (created.length > 0) {
    Logger.log('Rode verifySheetSchema() para confirmar que ficou tudo certo.');
  }
  return result;
}

/**
 * Confere que a planilha tem as abas/colunas esperadas por SheetService.gs.
 * Nao altera nada na planilha - somente leitura.
 * @return {{ok: boolean, issues: Array<string>}}
 */
function verifySheetSchema() {
  var issues = [];
  var spreadsheet;

  try {
    spreadsheet = getSpreadsheet_();
  } catch (err) {
    issues.push('Nao foi possivel abrir a planilha: ' + err.message);
    return logAndReturnDiagnostics_(issues);
  }

  var skillsSheet = spreadsheet.getSheetByName(SKILLS_SHEET_NAME);
  if (!skillsSheet) {
    issues.push('Aba "' + SKILLS_SHEET_NAME + '" nao encontrada.');
  } else {
    var skillsHeaderRow = skillsSheet.getRange(1, 1, 1, Math.max(skillsSheet.getLastColumn(), SKILLS_HEADERS.length)).getValues()[0];
    compareHeaders_(SKILLS_SHEET_NAME, SKILLS_HEADERS, skillsHeaderRow, issues);
  }

  var categoriasSheet = spreadsheet.getSheetByName(CATEGORIAS_SHEET_NAME);
  if (!categoriasSheet) {
    issues.push('Aba "' + CATEGORIAS_SHEET_NAME + '" nao encontrada.');
  } else {
    var categoriasHeaderRow = categoriasSheet.getRange(1, 1, 1, 1).getValues()[0];
    if (categoriasHeaderRow[0] !== 'categoria') {
      issues.push(
        'Header da aba "' + CATEGORIAS_SHEET_NAME + '" deveria ser "categoria", encontrado: "' +
        categoriasHeaderRow[0] + '".'
      );
    }

    var categorias = getCategorias();
    if (categorias.length === 0) {
      issues.push('Aba "' + CATEGORIAS_SHEET_NAME + '" nao tem nenhuma categoria cadastrada.');
    } else {
      Logger.log('Categorias encontradas (' + categorias.length + '): ' + categorias.join(', '));
    }
  }

  return logAndReturnDiagnostics_(issues);
}

/**
 * Compara o header real de uma aba contra o header esperado, coluna a coluna.
 * @param {string} sheetName
 * @param {Array<string>} expectedHeaders
 * @param {Array} actualHeaderRow
 * @param {Array<string>} issues acumulador de problemas encontrados
 * @private
 */
function compareHeaders_(sheetName, expectedHeaders, actualHeaderRow, issues) {
  for (var i = 0; i < expectedHeaders.length; i++) {
    var expected = expectedHeaders[i];
    var actual = actualHeaderRow[i];
    if (actual !== expected) {
      issues.push(
        'Aba "' + sheetName + '", coluna ' + (i + 1) + ': esperado "' + expected +
        '", encontrado "' + (actual === undefined || actual === '' ? '(vazio)' : actual) + '".'
      );
    }
  }
}

/**
 * Loga o resultado no Execution Log e devolve o objeto de diagnostico.
 * @param {Array<string>} issues
 * @return {{ok: boolean, issues: Array<string>}}
 * @private
 */
function logAndReturnDiagnostics_(issues) {
  var result = { ok: issues.length === 0, issues: issues };
  if (result.ok) {
    Logger.log('verifySheetSchema: OK - planilha compativel com o schema esperado.');
  } else {
    Logger.log('verifySheetSchema: ' + issues.length + ' problema(s) encontrado(s):');
    issues.forEach(function (issue, index) {
      Logger.log((index + 1) + '. ' + issue);
    });
  }
  return result;
}
