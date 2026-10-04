/**
 * Codex Munin - AI Tech Radar: classificacao estilo ThoughtWorks Technology
 * Radar (https://www.thoughtworks.com/radar), com os mesmos dois eixos usados
 * la: anel de adocao (Adopt/Trial/Assess/Hold) e categoria do blip
 * (Techniques/Tools/Platforms/Languages & Frameworks).
 */
var AI_RADAR_SHEET = 'AI_Radar';
var AI_RADAR_HEADERS = ['id', 'nome', 'quadrante', 'categoria_blip', 'descricao', 'autor', 'data'];
var AI_RADAR_QUADRANTES = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'];
var AI_RADAR_CATEGORIAS_BLIP = ['TECHNIQUES', 'TOOLS', 'PLATFORMS', 'LANGUAGES_FRAMEWORKS'];

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
 * @param {{nome: string, quadrante: string, categoria_blip?: string, descricao?: string}} payload
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
    var categoriaBlip = payload.categoria_blip || 'TOOLS';
    if (AI_RADAR_CATEGORIAS_BLIP.indexOf(categoriaBlip) === -1) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Categoria invalida: ' + categoriaBlip);
    }
    var saved = appendRow_(AI_RADAR_SHEET, AI_RADAR_HEADERS, {
      nome: payload.nome,
      quadrante: payload.quadrante,
      categoria_blip: categoriaBlip,
      descricao: payload.descricao || '',
      autor: Session.getActiveUser().getEmail()
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}
