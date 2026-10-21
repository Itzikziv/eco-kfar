/**
 * ESCAPE ROOMS — called from the pages with google.script.run
 * Answers come from the "Answers" tab of the spreadsheet, never from the repo.
 */

function checkAnswer(room, team, guess) {
  room = String(room);
  team = cleanTeam_(team);
  if (!ROOMS.some(r => r.id === room)) throw new Error('החדר לא רשום ב-Rooms.gs: ' + room);

  const key = answers_()[room];
  if (!key) throw new Error('למורה: חסרה תשובה לחדר "' + room + '" בלשונית Answers');

  const correct = normalize_(guess) === normalize_(key.answer);
  appendRow_('Attempts', [new Date(), team, room, String(guess || '').slice(0, 60), correct]);
  return correct ? { correct: true, fragment: key.fragment } : { correct: false };
}

function getEscapeData() {
  const base = ScriptApp.getService().getUrl();
  const rooms = ROOMS.map(r => ({
    id: r.id, title: r.title, group: r.group,
    url: base + '?room=' + encodeURIComponent(r.id)
  }));

  const escaped = new Set(readRows_('Escapes').map(r => String(r.team)));
  const teams = {};
  readRows_('Attempts').forEach(a => {
    const t = String(a.team);
    teams[t] = teams[t] || { team: t, solved: {}, tries: 0 };
    teams[t].tries++;
    if (a.correct === true && a.room !== 'MASTER') teams[t].solved[String(a.room)] = true;
  });

  const board = Object.values(teams).map(t => ({
    team: t.team,
    tries: t.tries,
    solved: rooms.map(r => !!t.solved[r.id]),
    count: rooms.filter(r => t.solved[r.id]).length,
    escaped: escaped.has(t.team)
  })).sort((a, b) => (b.escaped - a.escaped) || (b.count - a.count) || (a.tries - b.tries));

  return { rooms, board };
}

// The final door. The master code = every room's fragment, in ROOMS order.
function checkMaster(team, code) {
  team = cleanTeam_(team);
  const a = answers_();
  const master = ROOMS.map(r => (a[r.id] ? String(a[r.id].fragment) : '')).join('');
  const ok = master !== '' && normalize_(code) === normalize_(master);

  appendRow_('Attempts', [new Date(), team, 'MASTER', String(code || '').slice(0, 60), ok]);
  if (ok && !readRows_('Escapes').some(r => String(r.team) === team)) {
    const first = readRows_('Attempts')
      .filter(x => String(x.team) === team)
      .map(x => new Date(x.time).getTime());
    appendRow_('Escapes', [new Date(), team, Math.round((Date.now() - Math.min(...first)) / 60000)]);
  }
  return ok;
}

// ---------- helpers ----------
function answers_() {
  const map = {};
  readRows_('Answers').forEach(r => {
    if (r.room) map[String(r.room).trim()] = { answer: String(r.answer), fragment: String(r.fragment) };
  });
  return map;
}

// Case and spaces don't matter: "b6d 12f" == "B6D12F"
function normalize_(s) {
  return String(s || '').toUpperCase().replace(/\s+/g, '');
}

function cleanTeam_(t) {
  return String(t || '').trim().slice(0, 30) || 'ללא שם';
}
