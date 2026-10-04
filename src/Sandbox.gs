/**
 * Codex Munin - Sandbox / Test-Drive: roda um input de teste contra a API do
 * Gemini para o usuario experimentar uma skill antes de clonar o repositorio.
 * Requer a Script Property GEMINI_API_KEY (nao configurada por padrao).
 */
var GEMINI_GENERATE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * @param {{skillNome: string, inputTexto: string}} payload
 * @return {{success: boolean, data?: {outputTexto: string}, errorCode?: string, message?: string}}
 */
function runSandboxPrompt(payload) {
  try {
    if (!payload || !payload.inputTexto) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Informe um input de teste.');
    }

    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      throw new SkillCatalogError(
        'MISSING_GEMINI_KEY',
        'Sandbox requer a Script Property GEMINI_API_KEY configurada no editor do Apps Script.'
      );
    }

    var prompt = 'Voce esta testando a skill "' + (payload.skillNome || 'sem nome') + '". ' +
      'Responda ao input do usuario de forma objetiva, simulando o comportamento esperado da skill.\n\n' +
      'Input do usuario: ' + payload.inputTexto;

    var response = UrlFetchApp.fetch(GEMINI_GENERATE_URL + '?key=' + apiKey, {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    var statusCode = response.getResponseCode();
    var body = JSON.parse(response.getContentText());

    if (statusCode >= 400) {
      throw new SkillCatalogError(
        'GEMINI_API_ERROR',
        (body.error && body.error.message) || 'Erro ao consultar a API do Gemini.'
      );
    }

    var outputTexto = body.candidates && body.candidates[0] && body.candidates[0].content &&
      body.candidates[0].content.parts && body.candidates[0].content.parts[0] &&
      body.candidates[0].content.parts[0].text;

    return { success: true, data: { outputTexto: outputTexto || '(sem resposta)' } };
  } catch (err) {
    return toErrorResult_(err);
  }
}
