// drawing.js — small canvas helpers shared by every scene.
// Each helper draws one simple shape or motif at a position, so the
// scene files stay readable: a scene reads like a list of things in a room.

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

// Rounded-rectangle path (fill with the current fillStyle, or stroke it).
export function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

// A five-pointed star, used for night skies and decorations.
export function star(ctx, x, y, outer, inner, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// A soft puffy cloud made of three circles and a flat base.
export function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  circle(ctx, x, y, 18 * s, fill);
  circle(ctx, x + 20 * s, y - 8 * s, 22 * s, fill);
  circle(ctx, x + 44 * s, y, 18 * s, fill);
  ctx.fillRect(x - 18 * s, y, 80 * s, 14 * s);
}

// A little bird: two curved wing strokes.
export function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 8 * s, y, 8 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 8 * s, y, 8 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

// A simple flower: stem, five round petals, yellow centre.
export function flower(ctx, x, y, petal, s = 1) {
  line(ctx, x, y, x, y + 16 * s, '#3d8b4f', 3 * s);
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 6 * s, petal);
  }
  circle(ctx, x, y, 5 * s, '#ffd94d');
}

// A vertical linear gradient filling the whole canvas.
export function skyGradient(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
