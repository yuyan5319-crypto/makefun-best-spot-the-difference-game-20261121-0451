// hud.js — the on-screen readouts around the two panels.
// The game logic owns the numbers; this file only writes them into the
// DOM: the level name, the found/total counter, the score, the timer bar
// and the little toast that names each difference as it is found.

const $ = (id) => document.getElementById(id);

let toastTimer = 0;

export function showLevel(scene, levelIndex, totalLevels) {
  $('level-name').textContent = `Scene ${levelIndex + 1} of ${totalLevels} — ${scene.name}`;
  $('level-tagline').textContent = scene.tagline;
}

export function showFound(found, total) {
  $('found-count').textContent = `${found} / ${total}`;
  const pips = $('pips');
  pips.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const pip = document.createElement('span');
    pip.className = 'pip' + (i < found ? ' pip-found' : '');
    pips.appendChild(pip);
  }
}

export function showScore(score, combo) {
  $('score-count').textContent = String(score);
  const comboEl = $('combo');
  if (combo >= 2) {
    comboEl.textContent = `Combo x${combo}`;
    comboEl.classList.add('combo-hot');
  } else {
    comboEl.textContent = '';
    comboEl.classList.remove('combo-hot');
  }
}

export function showHints(left) {
  $('hint-count').textContent = String(left);
  $('hint-btn').disabled = left <= 0;
}

export function showTimer(secondsLeft, total) {
  const s = Math.max(0, Math.ceil(secondsLeft));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  $('timer-text').textContent = `${mm}:${ss}`;
  const bar = $('timer-fill');
  bar.style.width = `${Math.max(0, (secondsLeft / total) * 100)}%`;
  bar.classList.toggle('timer-low', secondsLeft <= 15);
}

export function showMute(muted) {
  $('mute-btn').textContent = muted ? 'Sound: Off (M)' : 'Sound: On (M)';
}

export function showToast(text) {
  const toast = $('toast');
  toast.textContent = text;
  toast.classList.add('toast-show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('toast-show'), 2200);
}

// Show one of the overlay screens (title / level complete / time up /
// victory) and hide the others. Pass null to hide them all.
export function showOverlay(id) {
  for (const el of document.querySelectorAll('.overlay')) {
    el.classList.toggle('overlay-hidden', el.id !== id);
  }
}

export function setLevelCompleteStats(found, total, timeBonus, levelScore, totalScore) {
  $('complete-found').textContent = `${found} / ${total} differences`;
  $('complete-bonus').textContent = `Time bonus: +${timeBonus}`;
  $('complete-score').textContent = `Scene score: ${levelScore}`;
  $('complete-total').textContent = `Total score: ${totalScore}`;
}

export function setVictoryStats(totalScore, totalFound, totalDiffs, bestCombo) {
  $('victory-score').textContent = String(totalScore);
  $('victory-found').textContent = `${totalFound} / ${totalDiffs} differences found`;
  $('victory-combo').textContent = `Best combo: x${bestCombo}`;
}
