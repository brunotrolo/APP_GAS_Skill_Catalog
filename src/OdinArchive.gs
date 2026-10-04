/**
 * Codex Munin - Odin Archive: biblioteca de documentos/manuais internos.
 */
var ODIN_DOCS_SHEET = 'Odin_Docs';
var ODIN_DOCS_HEADERS = ['id', 'titulo', 'categoria', 'conteudo_url', 'resumo', 'autor', 'data'];

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getOdinDocs() {
  try {
    return { success: true, data: readAllRows_(ODIN_DOCS_SHEET, ODIN_DOCS_HEADERS) };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{titulo: string, categoria?: string, conteudo_url: string, resumo?: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function addOdinDoc(payload) {
  try {
    if (!payload || !payload.titulo || !payload.conteudo_url) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Titulo e URL do conteudo sao obrigatorios.');
    }
    var saved = appendRow_(ODIN_DOCS_SHEET, ODIN_DOCS_HEADERS, {
      titulo: payload.titulo,
      categoria: payload.categoria || '',
      conteudo_url: payload.conteudo_url,
      resumo: payload.resumo || '',
      autor: Session.getActiveUser().getEmail()
    });
    return { success: true, data: saved };
  } catch (err) {
    return toErrorResult_(err);
  }
}
