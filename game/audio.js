// audio.js — tiny synthesised sound effects, no audio files.
// Everything is an oscillator through a gain envelope, created lazily
// on the first user gesture so browsers allow it. M toggles mute.

let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  if (muted) return;
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime + startAt;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFind() {
  tone(660, 0, 0.16, 'sine', 0.22);
  tone(990, 0.09, 0.28, 'sine', 0.2);
}

// A dull low buzz for a wrong click.
export function playWrong() {
  tone(140, 0, 0.18, 'sawtooth', 0.1);
  tone(110, 0.05, 0.2, 'sawtooth', 0.08);
}

// A soft pluck when a hint is used.
export function playHint() {
  tone(520, 0, 0.2, 'triangle', 0.16);
  tone(780, 0.07, 0.24, 'triangle', 0.12);
}

// A little rising arpeggio when a scene is completed.
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.2));
}

// A short click for buttons.
export function playClick() {
  tone(440, 0, 0.07, 'square', 0.06);
}

// A tick for the last ten seconds of the timer.
export function playTick() {
  tone(880, 0, 0.06, 'sine', 0.1);
}
