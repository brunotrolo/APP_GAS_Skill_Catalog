/**
 * Codex Munin - Wall of Fame: registro de impacto real de uma skill (ROI),
 * reportado pelos proprios times que a usaram.
 */
var WALL_OF_FAME_SHEET = 'Wall_of_Fame';
var WALL_OF_FAME_HEADERS = ['id', 'skill_nome', 'time', 'impacto', 'reportado_por', 'data'];

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getWallOfFameEntries() {
  try {
    var items = readAllRows_(WALL_OF_FAME_SHEET, WALL_OF_FAME_HEADERS);
    items.sort(function (a, b) { return new Date(b.data) - new Date(a.data); });
    return { success: true, data: items };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{skill_nome: string, time: string, impacto: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function addWallOfFameEntry(payload) {
  try {
    if (!payload || !payload.skill_nome || !payload.impacto) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Nome da skill e descricao do impacto sao obrigatorios.');
    }
    var saved = appendRow_(WALL_OF_FAME_SHEET, WALL_OF_FAME_HEADERS, {
      skill_nome: payload.skill_nome,
      time: payload.time || '',
      impacto: payload.impacto,
      reportado_por: Session.getActiveUser().getEmail()
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}
