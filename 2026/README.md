# CS Day 2026: Arcade + Escape Rooms

One Google Apps Script web app serves everything:

| Link | Page |
|---|---|
| `<web app URL>` | Home: links to the arcade and the escape rooms |
| `<web app URL>?page=arcade` | Arcade lobby: game cabinets + live top 5 |
| `<web app URL>?page=escape` | Escape lobby: rooms, live progress board, the final door |
| `<web app URL>?game=<id>` | One game |
| `<web app URL>?room=<id>` | One escape room |

Everything is logged in one Google Sheet: scores, every guess, every escape.

## What's in this folder

```
.clasp.json            the Apps Script project (script ID); clasp pushes src/
src/                   exactly what goes to Apps Script
  Code.gs              router: which page each link shows
  Data.gs              the spreadsheet: setup() + helpers
  Arcade.gs            scores + lobby data
  Games.gs             THE LIST OF GAMES
  Escape.gs            answer checking, progress board, final door
  Rooms.gs             THE LIST OF ROOMS (no answers!)
  home.html            home page
  arcade/lobby.html
  arcade/games/*.html  one file per game
  escape/lobby.html
  escape/rooms/*.html  one file per room
student/               templates the groups start from (not pushed)
  game-template.html
  room-template.html
```

## The examples

| Type | id | What it shows | Answer · fragment |
|---|---|---|---|
| Game | `reaction` | Timers and `Math.random()`. Lower score wins. | |
| Game | `caesar` | Char arithmetic, levels, feedback at game over | |
| Game | `bugs` | A game loop: move, collide, draw | |
| Game | `memory` | Shuffling, pairs, ASCII codes. Lower score wins. | |
| Room | `caesar` | Unknown-shift Caesar cipher | `BYTE` · `7` |
| Room | `java-trace` | "What does this Java print?" | `B6D12F` · `K` |
| Room | `binary` | Binary → ASCII | `GREEN` · `3` |
| Room | `sum-lock` | Write a loop to find the number | `1189524` · `Z` |

With the four example rooms, the master code is `7K3Z`.
The example answers are written in `Data.gs`, so they're public in this repo.
That's fine for demos; real rooms' answers go only in the sheet.

After pulling new example rooms, run `setup()` again in the editor:
it adds the missing example answers and changes nothing else.

## One-time setup (teacher)

1. **Install clasp** (needs Node.js): `npm install -g @google/clasp`
2. **Turn on the Apps Script API** for your account: https://script.google.com/home/usersettings
3. **Log in:** `clasp login` (opens the browser once).
4. **Create the project:** script.google.com → New project. Name it "CS Day 2026".
   Copy its **script ID** (Project Settings, or the editor URL between `/projects/` and `/edit`)
   into `2026/.clasp.json`.
5. **Push the code:** from the `2026` folder run `clasp push`.
   Answer **yes** if it asks to overwrite the manifest.
6. **Create the spreadsheet:** in the Apps Script editor, choose `setup` in the function list and click Run.
   Approve the permissions. The log prints the sheet's link. It already has the two example answers.
7. **Deploy:** Deploy → New deployment → type **Web app** → Execute as **Me**,
   Who has access **Anyone** → Deploy. Save the URL: that's the link for the day.
   Write down the **deployment ID** too.

If students sign in with school Google accounts and "Anyone" is blocked by the school admin,
change `"access"` in `src/appsscript.json` to `"DOMAIN"`.

## Every update after that

```bash
cd 2026
git pull
clasp push
clasp deploy -i <deployment ID> -d "short note"
```

`clasp deploy -i` updates the existing deployment, so the URL never changes.
(Without `-i` it creates a new URL.)
To check changes before they go live, use Deploy → Test deployments in the editor:
that link always runs the latest pushed code.

The repo is the only source. Anything changed directly in the Apps Script editor is overwritten by the next `clasp push`.

## Adding a game

1. The group builds `student/game-template.html` into their game and tests it by double-clicking it.
   Locally the game works fully; only the score isn't saved.
2. The file goes in as `src/arcade/games/<id>.html`. `<id>` = lowercase letters, digits, `-`, `_`,
   and the same value as `GAME_ID` inside the file.
3. Add one entry to `src/Games.gs` (title, group, icon, description, `lowerIsBetter`).
4. Push + deploy.

## Adding an escape room

1. The group builds `student/room-template.html` into their room.
2. The file goes in as `src/escape/rooms/<id>.html`, with `ROOM_ID` inside the file set to `<id>`.
3. Add one entry to `src/Rooms.gs`. The order there is the order of the rooms.
4. **The answer and the fragment go only in the `Answers` tab of the spreadsheet**, never in the repo:
   anyone with access to the repo could read them.
   The master code is every room's fragment joined in the `Rooms.gs` order.
5. Push + deploy.

## How students submit

- **12th grade:** branch → commit their file + the list entry → pull request. The teacher reviews and merges.
- **10th grade:** on github.com, open the folder → "Add file" → "Upload files" → "Propose changes",
  which opens a pull request for them. No git commands needed.
- Group rules: one file per game or room, only change the part below *YOUR GAME / ROOM STARTS HERE*,
  call `gameOver(score)` once (or `gameOver(score, note)` to show a message under the score), use `pointerdown` (phones), no external images.

## Opening the pages locally

Every page opens by double-click, with no Apps Script:

- `src/home.html` → links to both lobbies.
- The lobbies show sample data with a yellow "local preview" banner.
- Games work fully; the score isn't saved.
- Rooms show the story, puzzle and hints; the answer is only checked in Apps Script.
