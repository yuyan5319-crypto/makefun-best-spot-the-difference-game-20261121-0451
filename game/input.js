// input.js — mouse and keyboard for Double Take.
// Clicks on either panel are converted to scene coordinates and handed
// to the game as a "try this point" event; keys are mapped to actions.
// Nothing here knows the score or the timer — it only reports input.

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

// Wire both panels to report clicks. `onTry` gets {x, y, panel}.
export function attachPanelClicks(leftCanvas, rightCanvas, onTry) {
  for (const [canvas, panel] of [[leftCanvas, 'left'], [rightCanvas, 'right']]) {
    canvas.addEventListener('pointerdown', (event) => {
      const point = canvasPoint(canvas, event);
      onTry({ ...point, panel });
    });
  }
}

// Map keys to game actions. The handler receives one of:
// 'hint' | 'mute' | 'restart' | 'next' | 'start' | 'level1' | 'level2' | 'level3'
export function attachKeys(onAction) {
  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') onAction('hint');
    else if (key === 'm') onAction('mute');
    else if (key === 'r') onAction('restart');
    else if (key === 'n' || key === 'enter') onAction('next');
    else if (key === '1') onAction('level1');
    else if (key === '2') onAction('level2');
    else if (key === '3') onAction('level3');
  });
}
