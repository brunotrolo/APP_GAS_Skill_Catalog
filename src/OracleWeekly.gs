/**
 * Codex Munin - Oracle Weekly: curadoria semanal de artigos de IA/engenharia.
 * A curadoria automatica via RSS + Gemini nao esta implementada ainda (requer
 * GEMINI_API_KEY e um gatilho semanal, ver installOracleWeeklyTrigger_() como
 * ponto de partida); por ora o registro e manual via addOracleItem().
 */
var ORACLE_WEEKLY_SHEET = 'Oracle_Weekly';
var ORACLE_WEEKLY_HEADERS = ['id', 'titulo', 'resumo', 'url', 'fonte', 'data'];

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getOracleItems() {
  try {
    var items = readAllRows_(ORACLE_WEEKLY_SHEET, ORACLE_WEEKLY_HEADERS);
    items.sort(function (a, b) { return new Date(b.data) - new Date(a.data); });
    return { success: true, data: items };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{titulo: string, resumo?: string, url: string, fonte?: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function addOracleItem(payload) {
  try {
    if (!payload || !payload.titulo || !payload.url) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Titulo e URL sao obrigatorios.');
    }
    var saved = appendRow_(ORACLE_WEEKLY_SHEET, ORACLE_WEEKLY_HEADERS, {
      titulo: payload.titulo,
      resumo: payload.resumo || '',
      url: payload.url,
      fonte: payload.fonte || ''
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}
