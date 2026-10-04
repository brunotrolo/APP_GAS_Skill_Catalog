/**
 * Codex Munin - Golden Prompts: biblioteca de prompts validados e compartilhados,
 * com suporte a variaveis no formato {{variavel}} para o usuario preencher antes
 * de copiar.
 */
var GOLDEN_PROMPTS_SHEET = 'Golden_Prompts';
var GOLDEN_PROMPTS_HEADERS = ['id', 'titulo', 'prompt_texto', 'variaveis', 'categoria', 'autor', 'usos', 'data'];

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getGoldenPrompts() {
  try {
    var items = readAllRows_(GOLDEN_PROMPTS_SHEET, GOLDEN_PROMPTS_HEADERS);
    items.sort(function (a, b) { return (Number(b.usos) || 0) - (Number(a.usos) || 0); });
    return { success: true, data: items };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{titulo: string, prompt_texto: string, variaveis?: string, categoria?: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function addGoldenPrompt(payload) {
  try {
    if (!payload || !payload.titulo || !payload.prompt_texto) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Titulo e texto do prompt sao obrigatorios.');
    }
    var saved = appendRow_(GOLDEN_PROMPTS_SHEET, GOLDEN_PROMPTS_HEADERS, {
      titulo: payload.titulo,
      prompt_texto: payload.prompt_texto,
      variaveis: payload.variaveis || '',
      categoria: payload.categoria || '',
      autor: Session.getActiveUser().getEmail(),
      usos: 0
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * Registra que um prompt foi copiado/usado (contador de efetividade simples).
 * @param {string} id
 * @return {{success: boolean, data?: number, errorCode?: string, message?: string}}
 */
function registerPromptUse(id) {
  try {
    if (!id) throw new SkillCatalogError('INVALID_PAYLOAD', 'id e obrigatorio.');
    return { success: true, data: incrementField_(GOLDEN_PROMPTS_SHEET, GOLDEN_PROMPTS_HEADERS, id, 'usos') };
  } catch (err) {
    return toErrorResult_(err);
  }
}
