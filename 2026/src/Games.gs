/**
 * THE ARCADE'S GAMES
 *
 * To add a game:
 *   1. Put the game file in  src/arcade/games/<id>.html
 *   2. Add one object below with the same id.
 * The order here is the order of the cabinets in the lobby.
 *
 *   id            lowercase letters, digits, - or _   (must match the file name)
 *   lowerIsBetter true for games where a smaller score wins (e.g. reaction time)
 */
const GAMES = [
  {
    id: 'reaction',
    title: 'זמן תגובה',
    group: 'דוגמה',
    icon: '⚡',
    description: 'חכו לירוק ולחצו הכי מהר שאפשר',
    lowerIsBetter: true
  },
  {
    id: 'caesar',
    title: 'מרוץ קיסר',
    group: 'דוגמה',
    icon: '🔐',
    description: 'פענחו כמה שיותר מילים מוצפנות ב-60 שניות',
    lowerIsBetter: false
  }
];
