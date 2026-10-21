/**
 * ARCADE — called from the pages with google.script.run
 */

function submitScore(game, player, score) {
  game = String(game);
  score = Number(score);
  if (!isFinite(score)) throw new Error('הניקוד חייב להיות מספר');
  if (!GAMES.some(g => g.id === game)) throw new Error('המשחק לא רשום ב-Games.gs: ' + game);
  appendRow_('Scores', [new Date(), game, String(player || 'אנונימי').slice(0, 20), score]);
  return true;
}

function getArcadeData() {
  const base = ScriptApp.getService().getUrl();
  const scores = readRows_('Scores');

  return GAMES.map(g => {
    const mine = scores.filter(s => String(s.game) === g.id);
    mine.sort((a, b) => g.lowerIsBetter ? a.score - b.score : b.score - a.score);
    return {
      id: g.id,
      title: g.title,
      group: g.group,
      icon: g.icon || '🎮',
      description: g.description || '',
      url: base + '?game=' + encodeURIComponent(g.id),
      plays: mine.length,
      top: mine.slice(0, 5).map(s => ({ player: String(s.player), score: Number(s.score) }))
    };
  });
}
