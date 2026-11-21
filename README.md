# Double Take — Spot the Difference

Two pictures. Seven differences. One sharp eye.

**Double Take** is a complete spot-the-difference game that runs entirely
offline in a desktop browser. Three original scenes — a sunny park, a cozy
kitchen, and a moonlit harbor — are drawn side by side with seven small
changes hidden in the right-hand picture. Click a difference on either
picture to circle it in red; find all seven before the timer runs out.

## How to play

- **Mouse:** click a difference on either picture. A correct find is
  circled on both panels; a wrong click costs 5 seconds.
- **H — Hint:** rings a difference you have not found yet (3 per scene,
  costs 25 points).
- **M — Sound:** mute or unmute the synthesised sound effects.
- **R — Restart:** restart the current scene.
- **N — Next:** move on after clearing a scene.
- **1 / 2 / 3:** jump straight to a scene from the title screen.

Finds in a row build a combo (up to +100 bonus points per find), and
clearing a scene with time to spare earns a time bonus. Beat all three
scenes to see your final score.

## Scenes

1. **Sunny Park** — a lazy afternoon: a bird, a kite, a duck and more.
2. **Cozy Kitchen** — tea is brewing, but the clock, the cat and the
   teapot are not quite as they were.
3. **Moonlit Harbor** — night on the water: stars, sails, lanterns and a
   lighthouse beam that swung around.

## How to run

No build step, no network. Serve the `game/` folder with any static
server and open `index.html`:

```sh
node serve.ts        # serves game/ at http://localhost:8080
```

or serve `game/` with any static file server of your choice.

## Layout

- `game/index.html` — page shell and HUD
- `game/style.css` — layout and HUD styling
- `game/main.js` — game state, timer, scoring, markers, render loop
- `game/scenes.js` — the three original scenes and their 21 differences
- `game/drawing.js` — small canvas helpers shared by the scenes
- `game/input.js` — mouse and keyboard handling
- `game/audio.js` — synthesised sound effects (WebAudio, no audio files)
- `game/hud.js` — the on-screen readouts (counter, score, timer, toast)
- `main.ts` — the make.fun hand-in program (copies `game/` and
  `screenshots/` and writes `dossier.json`)
- `screenshots/` — real renders of the game in a browser

All art is drawn in code on canvas and all sounds are synthesised — the
game loads nothing from the network.
