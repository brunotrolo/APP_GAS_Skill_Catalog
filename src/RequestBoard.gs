/**
 * Codex Munin - Odin Request Board: mural de "missoes" (skills que o time
 * gostaria que existissem), com upvote para ajudar a priorizar.
 */
var REQUEST_BOARD_SHEET = 'Request_Board';
var REQUEST_BOARD_HEADERS = ['id', 'titulo', 'descricao', 'solicitante', 'status', 'votos', 'data'];
var REQUEST_BOARD_DEFAULT_STATUS = 'ABERTA';

/**
 * @return {{success: boolean, data?: Array<Object>, message?: string}}
 */
function getRequestBoardItems() {
  try {
    var items = readAllRows_(REQUEST_BOARD_SHEET, REQUEST_BOARD_HEADERS);
    items.sort(function (a, b) { return (Number(b.votos) || 0) - (Number(a.votos) || 0); });
    return { success: true, data: items };
  } catch (err) {
    return toErrorResult_(err);
  }
}

/**
 * @param {{titulo: string, descricao?: string}} payload
 * @return {{success: boolean, data?: Object, errorCode?: string, message?: string}}
 */
function addRequestBoardItem(payload) {
  try {
    if (!payload || !payload.titulo) {
      throw new SkillCatalogError('INVALID_PAYLOAD', 'Titulo da missao e obrigatorio.');
    }
    var saved = appendRow_(REQUEST_BOARD_SHEET, REQUEST_BOARD_HEADERS, {
      titulo: payload.titulo,
      descricao: payload.descricao || '',
      solicitante: Session.getActiveUser().getEmail(),
      status: REQUEST_BOARD_DEFAULT_STATUS,
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
function upvoteRequestBoardItem(id) {
  try {
    if (!id) throw new SkillCatalogError('INVALID_PAYLOAD', 'id e obrigatorio.');
    return { success: true, data: incrementField_(REQUEST_BOARD_SHEET, REQUEST_BOARD_HEADERS, id, 'votos') };
  } catch (err) {
    return toErrorResult_(err);
  }
}
