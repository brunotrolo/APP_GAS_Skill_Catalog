/**
 * Codex Munin - ponto de entrada do Web App.
 */

/**
 * @param {GoogleAppsScript.Events.DoGet} e
 * @return {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Codex Munin - Odin Skills')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper padrao do HtmlService para incluir partials (CSS/JS/HTML) em Index.html.
 * @param {string} filename
 * @return {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
