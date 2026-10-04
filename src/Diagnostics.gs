/**
 * Codex Munin - diagnostico de schema da planilha.
 * Rode manualmente pelo editor do Apps Script (selecione a funcao
 * "verifySheetSchema" no dropdown de funcoes e clique em Run) para confirmar
 * que a planilha configurada em SPREADSHEET_ID tem as abas e colunas que o
 * app espera, antes de publicar o Web App.
 */

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
