/**
 * Codex Munin - Community Radar: devs sinalizam ferramentas OSS em alta
 * ainda nao catalogadas, com votos simples para priorizar curadoria futura.
 */
var COMMUNITY_RADAR_SHEET = 'Community_Radar';
var COMMUNITY_RADAR_HEADERS = ['id', 'nome_ferramenta', 'url', 'descricao', 'sugerido_por', 'votos', 'data'];

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getCommunityRadarItems() {
  try {
    var items = readAllRows_(COMMUNITY_RADAR_SHEET, COMMUNITY_RADAR_HEADERS);
    items.sort(function (a, b) { return (Number(b.votos) || 0) - (Number(a.votos) || 0); });
    return { success: true, data: items };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{nome_ferramenta: string, url: string, descricao?: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function suggestCommunityTool(payload) {
  try {
    if (!payload || !payload.nome_ferramenta || !payload.url) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Nome da ferramenta e URL sao obrigatorios.');
    }
    var saved = appendRow_(COMMUNITY_RADAR_SHEET, COMMUNITY_RADAR_HEADERS, {
      nome_ferramenta: payload.nome_ferramenta,
      url: payload.url,
      descricao: payload.descricao || '',
      sugerido_por: Session.getActiveUser().getEmail(),
      votos: 0
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {string} id
 * @return {{success: boolean, data?: number, errorCode?: string, message?: string}}
 */
function upvoteCommunityTool(id) {
  try {
    if (!id) throw new SkillCatalogError('INVALID_PAYLOAD', 'id e obrigatorio.');
    return { success: true, data: incrementField_(COMMUNITY_RADAR_SHEET, COMMUNITY_RADAR_HEADERS, id, 'votos') };
  } catch (err) {
    return toErrorResult_(err);
  }
}
