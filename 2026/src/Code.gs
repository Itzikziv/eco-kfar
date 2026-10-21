/**
 * CS DAY 2026 — router
 *
 * One web app serves every page:
 *   <url>                    home page (arcade + escape rooms)
 *   <url>?page=arcade        arcade lobby
 *   <url>?page=escape        escape-room lobby
 *   <url>?game=<id>          a game   -> file arcade/games/<id>.html
 *   <url>?room=<id>          a room   -> file escape/rooms/<id>.html
 */

function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;

  if (p.game) {
    const g = GAMES.find(x => x.id === p.game);
    out = pageFromFile_('arcade/games/', p.game, g ? g.title : p.game);
  } else if (p.room) {
    const r = ROOMS.find(x => x.id === p.room);
    out = pageFromFile_('escape/rooms/', p.room, r ? r.title : p.room);
  } else if (p.page === 'arcade') {
    out = HtmlService.createHtmlOutputFromFile('arcade/lobby').setTitle('הארקייד');
  } else if (p.page === 'escape') {
    out = HtmlService.createHtmlOutputFromFile('escape/lobby').setTitle('בריחה מהמעבדה');
  } else {
    out = HtmlService.createHtmlOutputFromFile('home').setTitle('יום מדעי המחשב 2026');
  }
  return out.addMetaTag('viewport', 'width=device-width, initial-scale=1, user-scalable=no');
}

function pageFromFile_(folder, id, title) {
  if (!/^[a-z0-9_-]+$/.test(id)) return notFound_();
  try {
    return HtmlService.createHtmlOutputFromFile(folder + id).setTitle(title);
  } catch (err) {
    return notFound_();
  }
}

function notFound_() {
  return HtmlService.createHtmlOutput('<div dir="rtl" style="font-family:Arial;padding:20px">הדף לא נמצא.</div>');
}

// Called from every page to build links (games, rooms, back to lobby).
function getBaseUrl() {
  return ScriptApp.getService().getUrl();
}
