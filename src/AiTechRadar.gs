/**
 * Codex Munin - AI Tech Radar: classificacao estilo ThoughtWorks (Adopt/Trial/
 * Assess/Hold) de tecnologias/ferramentas de IA sendo avaliadas pelo time.
 */
var AI_RADAR_SHEET = 'AI_Radar';
var AI_RADAR_HEADERS = ['id', 'nome', 'quadrante', 'descricao', 'autor', 'data'];
var AI_RADAR_QUADRANTES = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'];

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getAiRadarItems() {
  try {
    return { success: true, data: readAllRows_(AI_RADAR_SHEET, AI_RADAR_HEADERS) };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{nome: string, quadrante: string, descricao?: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function addAiRadarItem(payload) {
  try {
    if (!payload || !payload.nome || !payload.quadrante) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Nome e quadrante sao obrigatorios.');
    }
    if (AI_RADAR_QUADRANTES.indexOf(payload.quadrante) === -1) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Quadrante invalido: ' + payload.quadrante);
    }
    var saved = appendRow_(AI_RADAR_SHEET, AI_RADAR_HEADERS, {
      nome: payload.nome,
      quadrante: payload.quadrante,
      descricao: payload.descricao || '',
      autor: Session.getActiveUser().getEmail()
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}
