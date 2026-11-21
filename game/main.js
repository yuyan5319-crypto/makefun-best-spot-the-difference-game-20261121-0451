// main.js — Double Take: the game itself.
// A spot-the-difference game in three original scenes. Two panels show
// the same scene side by side; the right one hides seven small changes.
// Click a change on either panel to circle it. Find all seven before
// the timer runs out, then move on to the next scene.
//
// Screens: 'title' | 'playing' | 'complete' | 'timeup' | 'victory'.
// The render loop redraws both panels every frame so markers, the hint
// pulse and wrong-click crosses animate smoothly.

import { SCENES } from './scenes.js';
import { attachKeys, attachPanelClicks } from './input.js';
import * as hud from './hud.js';
import * as sfx from './audio.js';

const PANEL_W = 600;
const PANEL_H = 400;
const FIND_POINTS = 100;
const STREAK_BONUS = 25;
const WRONG_PENALTY_SECONDS = 5;
const HINT_COST = 25;
const HINTS_PER_LEVEL = 3;
const HINT_MS = 2500;

const leftCanvas = document.getElementById('panel-left');
const rightCanvas = document.getElementById('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');
leftCanvas.width = PANEL_W;
leftCanvas.height = PANEL_H;
rightCanvas.width = PANEL_W;
rightCanvas.height = PANEL_H;

const game = {
  screen: 'title',
  levelIndex: 0,
  found: new Set(),
  wrongMarks: [],
  hint: null, // { diff, until }
  score: 0,
  levelScore: 0,
  streak: 0,
  bestCombo: 0,
  hintsLeft: HINTS_PER_LEVEL,
  timeLeft: 0,
  lastWholeSecond: -1,
  frozen: false, // set by ?shot= so screenshots show a fixed timer
};

function scene() {
  return SCENES[game.levelIndex];
}

function startLevel(index) {
  game.levelIndex = index;
  game.found = new Set();
  game.wrongMarks = [];
  game.hint = null;
  game.levelScore = 0;
  game.streak = 0;
  game.hintsLeft = HINTS_PER_LEVEL;
  game.timeLeft = scene().timeLimit;
  game.lastWholeSecond = -1;
  game.screen = 'playing';
  hud.showLevel(scene(), index, SCENES.length);
  hud.showFound(0, scene().differences.length);
  hud.showScore(game.score, 0);
  hud.showHints(game.hintsLeft);
  hud.showTimer(game.timeLeft, scene().timeLimit);
  hud.showOverlay(null);
}

function startGame(index = 0) {
  game.score = 0;
  game.bestCombo = 0;
  startLevel(index);
}

function nearestUnfound(point) {
  let best = null;
  let bestDist = Infinity;
  for (const diff of scene().differences) {
    if (game.found.has(diff.id)) continue;
    const d = Math.hypot(point.x - diff.x, point.y - diff.y);
    if (d < diff.r + 10 && d < bestDist) {
      best = diff;
      bestDist = d;
    }
  }
  return best;
}

function tryPoint(point) {
  if (game.screen !== 'playing') return;
  const diff = nearestUnfound(point);
  if (diff) {
    game.found.add(diff.id);
    game.streak += 1;
    game.bestCombo = Math.max(game.bestCombo, game.streak);
    const points = FIND_POINTS + STREAK_BONUS * Math.min(game.streak - 1, 4);
    game.score += points;
    game.levelScore += points;
    sfx.playFind();
    hud.showFound(game.found.size, scene().differences.length);
    hud.showScore(game.score, game.streak);
    hud.showToast(`Found it — ${diff.name}! +${points}`);
    if (game.found.size === scene().differences.length) completeLevel();
  } else {
    game.streak = 0;
    game.timeLeft = Math.max(0, game.timeLeft - WRONG_PENALTY_SECONDS);
    game.wrongMarks.push({ x: point.x, y: point.y, panel: point.panel, at: performance.now() });
    sfx.playWrong();
    hud.showScore(game.score, 0);
    hud.showToast(`Not there — minus ${WRONG_PENALTY_SECONDS} seconds`);
    hud.showTimer(game.timeLeft, scene().timeLimit);
  }
}

function useHint() {
  if (game.screen !== 'playing' || game.hintsLeft <= 0) return;
  const remaining = scene().differences.filter((d) => !game.found.has(d.id));
  if (remaining.length === 0) return;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.hint = { diff, until: performance.now() + HINT_MS };
  sfx.playHint();
  hud.showHints(game.hintsLeft);
  hud.showScore(game.score, game.streak);
  hud.showToast(`Hint: look near the ${diff.name.toLowerCase().replace(/^a |^an |^the /, '')}… (−${HINT_COST})`);
}

function completeLevel() {
  const timeBonus = Math.round(game.timeLeft) * 2;
  game.score += timeBonus;
  game.levelScore += timeBonus;
  sfx.playWin();
  // Freeze the HUD timer on the time that earned the bonus, so the
  // readout and the bonus agree once the scene is over.
  hud.showTimer(game.timeLeft, scene().timeLimit);
  if (game.levelIndex + 1 >= SCENES.length) {
    const totalFound = SCENES.reduce((n, s) => n + s.differences.length, 0);
    hud.setVictoryStats(game.score, totalFound, totalFound, game.bestCombo);
    game.screen = 'victory';
    hud.showOverlay('overlay-victory');
  } else {
    hud.setLevelCompleteStats(
      scene().differences.length,
      scene().differences.length,
      timeBonus,
      game.levelScore,
      game.score,
    );
    game.screen = 'complete';
    hud.showOverlay('overlay-complete');
  }
  hud.showScore(game.score, 0);
}

function timeUp() {
  game.screen = 'timeup';
  sfx.playWrong();
  hud.showToast('Time is up!');
  hud.showOverlay('overlay-timeup');
}

function nextScreen() {
  if (game.screen === 'complete') startLevel(game.levelIndex + 1);
  else if (game.screen === 'title' || game.screen === 'victory' || game.screen === 'timeup') startGame(0);
}

function onKeyAction(action) {
  if (action === 'hint') useHint();
  else if (action === 'mute') hud.showMute(sfx.toggleMute());
  else if (action === 'restart') startLevel(game.levelIndex);
  else if (action === 'next') nextScreen();
  else if (action === 'level1' && game.screen === 'title') startGame(0);
  else if (action === 'level2' && game.screen === 'title') startGame(1);
  else if (action === 'level3' && game.screen === 'title') startGame(2);
}

// --- Drawing ---------------------------------------------------------------

function drawMarker(ctx, diff, now) {
  ctx.save();
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r + 5, 0, Math.PI * 2);
  ctx.stroke();
  // A small check mark inside the ring.
  ctx.beginPath();
  ctx.moveTo(diff.x - 8, diff.y);
  ctx.lineTo(diff.x - 2, diff.y + 7);
  ctx.lineTo(diff.x + 10, diff.y - 7);
  ctx.stroke();
  ctx.restore();
}

function drawPanels(now) {
  const current = scene();
  current.draw(leftCtx, PANEL_W, PANEL_H, 'left');
  current.draw(rightCtx, PANEL_W, PANEL_H, 'right');
  for (const diff of current.differences) {
    if (!game.found.has(diff.id)) continue;
    drawMarker(leftCtx, diff, now);
    drawMarker(rightCtx, diff, now);
  }
  // Hint pulse: a breathing yellow ring around one unfound difference.
  if (game.hint && now < game.hint.until) {
    const pulse = 1 + 0.18 * Math.sin(now / 130);
    for (const ctx of [leftCtx, rightCtx]) {
      ctx.save();
      ctx.strokeStyle = '#ffd94d';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.arc(game.hint.diff.x, game.hint.diff.y, (game.hint.diff.r + 8) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  // Wrong-click crosses fade out over half a second.
  game.wrongMarks = game.wrongMarks.filter((m) => now - m.at < 600);
  for (const mark of game.wrongMarks) {
    const ctx = mark.panel === 'left' ? leftCtx : rightCtx;
    const alpha = 1 - (now - mark.at) / 600;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mark.x - 9, mark.y - 9);
    ctx.lineTo(mark.x + 9, mark.y + 9);
    ctx.moveTo(mark.x + 9, mark.y - 9);
    ctx.lineTo(mark.x - 9, mark.y + 9);
    ctx.stroke();
    ctx.restore();
  }
}

// --- Main loop -------------------------------------------------------------

let lastFrame = performance.now();

function frame(now) {
  const dt = Math.min(0.25, (now - lastFrame) / 1000);
  lastFrame = now;
  if (game.screen === 'playing' && !game.frozen) {
    game.timeLeft -= dt;
    const whole = Math.ceil(game.timeLeft);
    if (whole !== game.lastWholeSecond) {
      game.lastWholeSecond = whole;
      if (whole <= 10 && whole > 0) sfx.playTick();
      hud.showTimer(game.timeLeft, scene().timeLimit);
    }
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      hud.showTimer(0, scene().timeLimit);
      timeUp();
    }
  }
  drawPanels(now);
  requestAnimationFrame(frame);
}

// --- Screenshot helper -----------------------------------------------------
// ?shot=cover shows scene 1 mid-hunt (3 of 7 found), ?shot=hint shows
// scene 2 with a hint ringing, ?shot=win shows the scene-complete card,
// and ?shot=title shows the title screen. The timer is frozen so the
// shot is the same every time it is taken.

// ?level=2 jumps straight into a scene (handy for sharing a scene link).
function applyLevelParam() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('shot')) return;
  const level = Number(params.get('level'));
  if (Number.isInteger(level) && level >= 1 && level <= SCENES.length) startGame(level - 1);
}

function applyShotParam() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  game.frozen = true;
  if (shot === 'cover') {
    startGame(0);
    for (const id of ['bird', 'sunglasses', 'flower']) game.found.add(id);
    game.score = 325;
    game.streak = 3;
    game.timeLeft = 107;
    hud.showFound(3, 7);
    hud.showScore(game.score, 3);
    hud.showTimer(game.timeLeft, scene().timeLimit);
  } else if (shot === 'hint') {
    startGame(1);
    game.found.add('clock');
    game.score = 100;
    game.streak = 1;
    game.timeLeft = 121;
    game.hint = { diff: scene().differences.find((d) => d.id === 'steam'), until: performance.now() + 60000 };
    hud.showFound(1, 7);
    hud.showScore(game.score, 1);
    hud.showTimer(game.timeLeft, scene().timeLimit);
  } else if (shot === 'win') {
    startGame(0);
    for (const d of scene().differences) game.found.add(d.id);
    game.score = 700;
    game.levelScore = 700;
    game.timeLeft = 96;
    hud.showFound(7, 7);
    hud.showScore(game.score, 0);
    completeLevel();
  }
  // 'title' needs nothing: the title screen is the default.
}

// --- Boot ------------------------------------------------------------------

function wireButtons() {
  document.getElementById('start-btn').addEventListener('click', () => { sfx.playClick(); startGame(0); });
  document.getElementById('next-btn').addEventListener('click', () => { sfx.playClick(); nextScreen(); });
  document.getElementById('retry-btn').addEventListener('click', () => { sfx.playClick(); startLevel(game.levelIndex); });
  document.getElementById('again-btn').addEventListener('click', () => { sfx.playClick(); startGame(0); });
  document.getElementById('restart-btn').addEventListener('click', () => { sfx.playClick(); startLevel(game.levelIndex); });
  document.getElementById('hint-btn').addEventListener('click', () => useHint());
  document.getElementById('mute-btn').addEventListener('click', () => hud.showMute(sfx.toggleMute()));
  for (const card of document.querySelectorAll('.level-card')) {
    card.addEventListener('click', () => {
      sfx.playClick();
      startGame(Number(card.dataset.level));
    });
  }
}

attachPanelClicks(leftCanvas, rightCanvas, tryPoint);
attachKeys(onKeyAction);
wireButtons();
hud.showLevel(scene(), 0, SCENES.length);
hud.showFound(0, scene().differences.length);
hud.showScore(0, 0);
hud.showHints(HINTS_PER_LEVEL);
hud.showTimer(scene().timeLimit, scene().timeLimit);
hud.showMute(false);
hud.showOverlay('overlay-title');
applyLevelParam();
applyShotParam();
requestAnimationFrame(frame);
