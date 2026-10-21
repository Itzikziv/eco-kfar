/**
 * The spreadsheet: everything that happens on the day is logged here.
 *
 * Run setup() ONCE from the Apps Script editor. It creates the spreadsheet
 * in your Drive, remembers its ID, and prints its link in the log.
 * No ID to paste anywhere.
 *
 * Tabs:
 *   Scores    arcade scores           (time, game, player, score)
 *   Attempts  every escape-room guess (time, team, room, guess, correct)
 *   Escapes   teams that opened the final door
 *   Answers   room answers + fragments. TEACHER ONLY. Not in the repo,
 *             because students with repo access could read them there.
 */

function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss;
  const id = props.getProperty('SHEET_ID');
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('CS Day 2026 - data');
    props.setProperty('SHEET_ID', ss.getId());
  }

  ensureSheet_(ss, 'Scores',   ['time', 'game', 'player', 'score']);
  ensureSheet_(ss, 'Attempts', ['time', 'team', 'room', 'guess', 'correct']);
  ensureSheet_(ss, 'Escapes',  ['time', 'team', 'minutes since first attempt']);
  const answers = ensureSheet_(ss, 'Answers', ['room', 'answer', 'fragment']);
  // Answers of the EXAMPLE rooms only. They are public in this repo, so they're
  // demos. Real rooms' answers are typed straight into the sheet, never here.
  // Adds only the rows that are missing: safe to run setup() again.
  const EXAMPLE_ANSWERS = [
    ['caesar',     'BYTE',    '7'],
    ['java-trace', 'B6D12F',  'K'],
    ['binary',     'GREEN',   '3'],
    ['sum-lock',   '1189524', 'Z']
  ];
  const have = answers.getDataRange().getValues().map(r => String(r[0]));
  EXAMPLE_ANSWERS.filter(r => !have.includes(r[0])).forEach(r => answers.appendRow(r));

  const first = ss.getSheets()[0];
  if (first.getName() === 'Sheet1' || first.getName() === 'גיליון1') ss.deleteSheet(first);

  console.log('Spreadsheet: ' + ss.getUrl());
}

function sheet_(name) {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('המערכת עוד לא הוגדרה: המורה צריך להריץ את setup()');
  return SpreadsheetApp.openById(id).getSheetByName(name);
}

function appendRow_(name, row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_(name).appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function readRows_(name) {
  const values = sheet_(name).getDataRange().getValues();
  const headers = values.shift();
  return values.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

function ensureSheet_(ss, name, headers) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  sh.setFrozenRows(1);
  return sh;
}
