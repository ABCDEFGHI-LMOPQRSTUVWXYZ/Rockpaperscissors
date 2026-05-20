# 🥊 Rock Paper Scissors — Tournament Mode

A browser-based Rock Paper Scissors game with a tournament system, battle log, confetti celebrations, and keyboard shortcuts. Built with vanilla HTML, CSS, and JavaScript — no build tools or dependencies required.

---

## Features

- **Tournament Mode** — First player to 3 wins claims the tournament
- **Live Scoreboard** — Tracks player vs. CPU wins with animated score display
- **Progress Bar** — Visual indicator of tournament progress
- **Battle Log** — Scrollable history of every round with taunts and results
- **Confetti Celebration** — Fires on tournament victory via `canvas-confetti`
- **Keyboard Shortcuts** — Play without touching the mouse
- **Responsive Design** — Works on mobile and desktop

---

## File Structure

```
├── index.html   # Game markup and layout
├── style.css    # All styling, animations, and responsive rules
└── script.js    # Game logic, state management, and event handlers
```

---

## Getting Started

No install needed. Just open `index.html` in any modern browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Serve locally (avoids any CORS quirks)
npx serve .
# or
python -m http.server 8080
```

---

## How to Play

| Action | Method |
|---|---|
| Choose Rock | Click **ROCK** button or press `1` |
| Choose Paper | Click **PAPER** button or press `2` |
| Choose Scissors | Click **SCISSORS** button or press `3` |
| Reset tournament | Click **RESET TOURNAMENT** or press `R` |
| Start a new match | Click **NEW MATCH** |

**Win condition:** Be the first to win 3 rounds. Ties don't count toward either score.

---

## Game Logic

- CPU picks randomly from rock / paper / scissors each round
- Standard rules apply: Rock beats Scissors, Scissors beats Paper, Paper beats Rock
- Tournament ends immediately when either side reaches 3 wins
- Buttons are disabled after a tournament concludes until reset

---

## Customization

| What to change | Where |
|---|---|
| Wins required to win tournament | `WINNING_SCORE` constant in `script.js` |
| Win / loss / tie taunts | `winTaunts`, `loseTaunts`, `tieMessages` arrays in `script.js` |
| Colors and layout | `style.css` CSS variables and class rules |
| Confetti style | `canvasConfetti(...)` calls inside `updateUI()` in `script.js` |

---

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | `@1` (CDN) | Tournament win celebration |

Loaded via CDN — no `npm install` required.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.
