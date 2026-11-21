// scenes.js — the three original scenes of Double Take.
// Every scene is drawn twice: once for the left panel (side 'left') and
// once for the right panel (side 'right'). A difference is a small branch
// inside draw(): something missing, recoloured, moved or added on the
// right. The differences list gives each one a click target (x, y, r)
// and a friendly name shown when it is found.

import { bird, circle, cloud, ellipse, flower, line, poly, rect, roundRect, skyGradient, star } from './drawing.js';

// side === 'right' means "draw the changed version".
function isRight(side) {
  return side === 'right';
}

const PARK = {
  id: 'park',
  name: 'Sunny Park',
  tagline: 'A lazy afternoon in the park — seven things changed.',
  timeLimit: 150,
  differences: [
    { id: 'bird', x: 462, y: 56, r: 22, name: 'A bird vanished from the sky' },
    { id: 'sunglasses', x: 80, y: 62, r: 42, name: 'The sun put on sunglasses' },
    { id: 'flower', x: 212, y: 366, r: 18, name: 'A flower changed colour' },
    { id: 'kite', x: 332, y: 102, r: 28, name: 'The kite lost its tail' },
    { id: 'bench', x: 432, y: 302, r: 26, name: 'A bench slat went missing' },
    { id: 'mushroom', x: 152, y: 352, r: 20, name: 'A mushroom sprouted' },
    { id: 'duck', x: 472, y: 342, r: 24, name: 'The duck swam away' },
  ],
  draw(ctx, w, h, side) {
    const right = isRight(side);
    skyGradient(ctx, w, h, '#8ec9ee', '#dff3ff');
    // Sun with a smile; on the right it wears sunglasses.
    circle(ctx, 80, 62, 36, '#ffd94d');
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 80 + Math.cos(a) * 44, 62 + Math.sin(a) * 44, 80 + Math.cos(a) * 54, 62 + Math.sin(a) * 54, '#f5b81e', 4);
    }
    if (right) {
      roundRect(ctx, 58, 52, 44, 16, 7, '#222831');
      line(ctx, 80, 60, 80, 66, '#222831', 3);
      ctx.beginPath();
      ctx.arc(80, 74, 7, 0, Math.PI);
      ctx.strokeStyle = '#8a5a2b';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      circle(ctx, 72, 56, 3.5, '#8a5a2b');
      circle(ctx, 88, 56, 3.5, '#8a5a2b');
      ctx.beginPath();
      ctx.arc(80, 68, 8, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#8a5a2b';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    cloud(ctx, 190, 52, 1, '#ffffff');
    cloud(ctx, 380, 38, 0.8, '#ffffff');
    cloud(ctx, 500, 92, 0.7, '#ffffff');
    // Birds: one of them only flies on the left.
    bird(ctx, 250, 74, 1, '#3a4a5a');
    bird(ctx, 300, 58, 0.8, '#3a4a5a');
    if (!right) bird(ctx, 462, 56, 1, '#3a4a5a');
    // Kite with a bowed tail — the tail is gone on the right.
    poly(ctx, [[332, 102], [356, 118], [332, 134], [308, 118]], '#e4572e');
    line(ctx, 332, 102, 332, 62, '#e4572e', 2);
    if (!right) {
      line(ctx, 332, 134, 344, 176, '#7a5a3a', 2);
      poly(ctx, [[344, 150], [350, 156], [344, 162], [338, 156]], '#f5b81e');
      poly(ctx, [[346, 168], [352, 174], [346, 180], [340, 174]], '#4d9de0');
    }
    // Rolling green hill.
    ellipse(ctx, 300, 470, 420, 110, '#7cbf6a');
    ellipse(ctx, 60, 440, 220, 90, '#6db35e');
    // Tree on the left.
    rect(ctx, 84, 250, 16, 100, '#7a5230');
    circle(ctx, 92, 222, 52, '#4d9b4d');
    circle(ctx, 52, 246, 34, '#57a857');
    circle(ctx, 132, 246, 34, '#57a857');
    circle(ctx, 92, 196, 30, '#5fb35a');
    // Pond with a duck — the duck is gone on the right.
    ellipse(ctx, 472, 344, 92, 26, '#6fb7e8');
    ellipse(ctx, 472, 344, 92, 26, 'rgba(255,255,255,0.25)');
    if (!right) {
      ellipse(ctx, 472, 338, 16, 10, '#ffffff');
      circle(ctx, 484, 330, 8, '#ffffff');
      circle(ctx, 486, 328, 1.8, '#222831');
      poly(ctx, [[491, 330], [498, 332], [491, 334]], '#f5a623');
    }
    // Bench: three slats on the left, two on the right.
    rect(ctx, 398, 296, 70, 8, '#8a5a2b');
    if (!right) rect(ctx, 398, 308, 70, 8, '#8a5a2b');
    rect(ctx, 398, 320, 70, 8, '#8a5a2b');
    rect(ctx, 402, 328, 6, 22, '#5d3d1e');
    rect(ctx, 458, 328, 6, 22, '#5d3d1e');
    // Flower bed: one flower swaps red for blue on the right.
    flower(ctx, 212, 366, right ? '#4d9de0' : '#e4572e');
    flower(ctx, 258, 372, '#f5b81e');
    flower(ctx, 306, 366, '#e4572e');
    flower(ctx, 168, 372, '#ffffff');
    // A mushroom sprouts on the right, under the tree.
    if (right) {
      rect(ctx, 148, 352, 8, 14, '#f5ead6');
      poly(ctx, [[134, 354], [170, 354], [152, 332]], '#e4572e');
      circle(ctx, 144, 344, 3, '#ffffff');
      circle(ctx, 158, 340, 3, '#ffffff');
    }
    // Path stones.
    ellipse(ctx, 300, 386, 14, 5, '#d8c9a8');
    ellipse(ctx, 330, 392, 14, 5, '#d8c9a8');
    ellipse(ctx, 360, 386, 14, 5, '#d8c9a8');
  },
};

const KITCHEN = {
  id: 'kitchen',
  name: 'Cozy Kitchen',
  tagline: 'Tea is brewing — but seven things are not as they were.',
  timeLimit: 150,
  differences: [
    { id: 'clock', x: 482, y: 82, r: 38, name: 'The clock shows a different time' },
    { id: 'cat', x: 148, y: 196, r: 24, name: "The cat's tail dropped" },
    { id: 'steam', x: 252, y: 236, r: 22, name: 'The teapot stopped steaming' },
    { id: 'apple', x: 172, y: 296, r: 22, name: 'An apple left the bowl' },
    { id: 'jar', x: 392, y: 88, r: 20, name: 'A jar label changed colour' },
    { id: 'spoon', x: 362, y: 316, r: 18, name: 'A spoon appeared on the table' },
    { id: 'picture', x: 376, y: 226, r: 28, name: 'The picture changed from sun to moon' },
  ],
  draw(ctx, w, h, side) {
    const right = isRight(side);
    // Wall and wooden floor.
    rect(ctx, 0, 0, w, 300, '#f7e8c8');
    rect(ctx, 0, 300, w, 100, '#c89b6a');
    line(ctx, 0, 330, w, 330, '#a87c4f', 2);
    line(ctx, 0, 365, w, 365, '#a87c4f', 2);
    // Rug under the table.
    ellipse(ctx, 300, 384, 170, 20, '#c96f4a');
    ellipse(ctx, 300, 384, 130, 13, '#e8a87c');
    // Window with curtains and a cat on the sill.
    roundRect(ctx, 56, 56, 180, 150, 8, '#bfe3f5');
    roundRect(ctx, 66, 66, 160, 130, 4, '#8ec9ee');
    circle(ctx, 110, 108, 26, '#ffd94d');
    cloud(ctx, 150, 92, 0.55, '#ffffff');
    line(ctx, 146, 66, 146, 196, '#ffffff', 4);
    line(ctx, 66, 131, 226, 131, '#ffffff', 4);
    poly(ctx, [[48, 48], [76, 48], [66, 210], [48, 210]], '#e4572e');
    poly(ctx, [[244, 48], [216, 48], [226, 210], [244, 210]], '#e4572e');
    rect(ctx, 48, 206, 196, 10, '#8a5a2b');
    // Cat: curled on the sill, tail up on the left, tail down on the right.
    ellipse(ctx, 148, 202, 26, 14, '#f2a541');
    circle(ctx, 168, 188, 12, '#f2a541');
    poly(ctx, [[160, 180], [164, 170], [168, 179]], '#f2a541');
    poly(ctx, [[172, 179], [177, 170], [179, 180]], '#f2a541');
    ctx.beginPath();
    if (right) {
      ctx.arc(126, 206, 10, Math.PI * 0.9, Math.PI * 1.9);
    } else {
      ctx.arc(126, 192, 10, Math.PI * 0.6, Math.PI * 1.6);
    }
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 6;
    ctx.stroke();
    // Shelf with three jars; the middle label swaps red for green.
    rect(ctx, 320, 108, 190, 10, '#8a5a2b');
    roundRect(ctx, 330, 66, 34, 42, 6, '#d8ead8');
    roundRect(ctx, 376, 66, 34, 42, 6, '#d8ead8');
    roundRect(ctx, 422, 66, 34, 42, 6, '#d8ead8');
    rect(ctx, 334, 82, 26, 14, right ? '#4d9b4d' : '#e4572e');
    rect(ctx, 380, 82, 26, 14, '#4d9de0');
    rect(ctx, 426, 82, 26, 14, '#f5b81e');
    // Wall clock: 3 o'clock on the left, half past 4 on the right.
    circle(ctx, 482, 82, 34, '#ffffff');
    circle(ctx, 482, 82, 34, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(482, 82, 34, 0, Math.PI * 2);
    ctx.strokeStyle = '#5d3d1e';
    ctx.lineWidth = 4;
    ctx.stroke();
    if (right) {
      line(ctx, 482, 82, 496, 96, '#222831', 4);
      line(ctx, 482, 82, 482, 104, '#222831', 3);
    } else {
      line(ctx, 482, 82, 506, 82, '#222831', 4);
      line(ctx, 482, 82, 482, 60, '#222831', 3);
    }
    circle(ctx, 482, 82, 3.5, '#e4572e');
    // Framed picture: a sunny hill on the left, a moonlit one on the right.
    roundRect(ctx, 330, 190, 92, 72, 6, '#8a5a2b');
    rect(ctx, 338, 198, 76, 56, right ? '#2b3a5e' : '#bfe3f5');
    if (right) {
      circle(ctx, 396, 214, 10, '#f5ead6');
      star(ctx, 352, 212, 6, 2.5, '#ffffff');
      star(ctx, 368, 206, 4, 2, '#ffffff');
    } else {
      circle(ctx, 356, 214, 10, '#ffd94d');
      ellipse(ctx, 376, 246, 38, 10, '#7cbf6a');
    }
    ellipse(ctx, 376, 246, 38, 10, right ? '#1f2c4a' : '#7cbf6a');
    // Table and its contents.
    roundRect(ctx, 96, 296, 408, 18, 8, '#a87c4f');
    rect(ctx, 120, 314, 12, 60, '#8a5a2b');
    rect(ctx, 468, 314, 12, 60, '#8a5a2b');
    // Fruit bowl: three apples on the left, two on the right.
    ellipse(ctx, 172, 302, 44, 12, '#4d9de0');
    circle(ctx, 152, 292, 11, '#e4572e');
    circle(ctx, 172, 288, 11, '#e4572e');
    if (!right) circle(ctx, 190, 293, 11, '#e4572e');
    line(ctx, 172, 278, 172, 272, '#3d8b4f', 2);
    // Teapot with steam — the steam is gone on the right.
    ellipse(ctx, 252, 296, 30, 12, '#e4572e');
    circle(ctx, 252, 274, 18, '#e4572e');
    rect(ctx, 246, 250, 12, 8, '#e4572e');
    poly(ctx, [[278, 272], [292, 282], [278, 288]], '#e4572e');
    if (!right) {
      ctx.beginPath();
      ctx.arc(252, 238, 8, Math.PI, 0);
      ctx.strokeStyle = 'rgba(120,120,120,0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(260, 222, 7, Math.PI, 0);
      ctx.stroke();
    }
    // Two cups; a spoon appears on the right.
    roundRect(ctx, 322, 288, 30, 20, 5, '#ffffff');
    roundRect(ctx, 398, 288, 30, 20, 5, '#ffffff');
    ellipse(ctx, 337, 288, 15, 4, '#8a5a2b');
    ellipse(ctx, 413, 288, 15, 4, '#8a5a2b');
    if (right) {
      ellipse(ctx, 362, 316, 4, 12, '#c0c0c0');
      line(ctx, 362, 304, 362, 296, '#c0c0c0', 3);
    }
  },
};

const HARBOR = {
  id: 'harbor',
  name: 'Moonlit Harbor',
  tagline: 'Night falls on the harbor — seven lights and shapes shifted.',
  timeLimit: 150,
  differences: [
    { id: 'star', x: 182, y: 62, r: 20, name: 'A bright star blinked out' },
    { id: 'beam', x: 152, y: 152, r: 32, name: 'The lighthouse beam swung around' },
    { id: 'sail', x: 352, y: 236, r: 28, name: 'The sail lost its red stripes' },
    { id: 'lantern', x: 212, y: 292, r: 22, name: 'A dock lantern went dark' },
    { id: 'fish', x: 302, y: 252, r: 22, name: 'A fish jumped out of the water' },
    { id: 'rope', x: 122, y: 332, r: 22, name: 'A rope coil disappeared' },
    { id: 'window', x: 92, y: 202, r: 18, name: 'The lighthouse window went dark' },
  ],
  draw(ctx, w, h, side) {
    const right = isRight(side);
    skyGradient(ctx, w, h, '#101a3a', '#2b3a5e');
    // Stars; one bright star only shines on the left.
    const stars = [[60, 40], [120, 90], [240, 40], [300, 80], [380, 46], [440, 96], [520, 40], [560, 110], [210, 130], [480, 150]];
    for (const [sx, sy] of stars) star(ctx, sx, sy, 4, 1.8, 'rgba(255,255,255,0.85)');
    if (!right) star(ctx, 182, 62, 12, 5, '#fff3b0');
    // Moon.
    circle(ctx, 500, 72, 34, '#f5ead6');
    circle(ctx, 490, 64, 7, '#e0d3b8');
    circle(ctx, 508, 82, 5, '#e0d3b8');
    // Sea.
    rect(ctx, 0, 250, w, 150, '#1d4e6b');
    for (let i = 0; i < 6; i++) {
      line(ctx, 20 + i * 100, 272 + (i % 2) * 14, 80 + i * 100, 272 + (i % 2) * 14, 'rgba(255,255,255,0.25)', 2);
    }
    // Moon reflection on the water.
    for (let i = 0; i < 5; i++) {
      line(ctx, 470 + i * 6, 268 + i * 18, 530 - i * 6, 268 + i * 18, 'rgba(245,234,214,0.5)', 3);
    }
    // Lighthouse: striped tower, light room, and a beam that swings
    // to the left on one side and to the right on the other.
    poly(ctx, [[76, 280], [108, 280], [102, 130], [82, 130]], '#f5ead6');
    rect(ctx, 80, 170, 26, 22, '#e4572e');
    rect(ctx, 77, 220, 30, 22, '#e4572e');
    roundRect(ctx, 74, 104, 36, 28, 4, '#333a45');
    circle(ctx, 92, 118, 10, right ? '#fff3b0' : '#ffd94d');
    // Window on the tower: lit on the left, dark on the right.
    roundRect(ctx, 84, 196, 16, 20, 3, right ? '#2b3a5e' : '#ffd94d');
    // Beam.
    ctx.save();
    ctx.globalAlpha = 0.35;
    if (right) {
      poly(ctx, [[108, 112], [240, 76], [240, 148]], '#ffe98a');
    } else {
      poly(ctx, [[76, 112], [0, 60], [0, 164]], '#ffe98a');
    }
    ctx.restore();
    // Sailboat: striped red sail on the left, plain white on the right.
    line(ctx, 352, 236, 352, 168, '#5d3d1e', 3);
    if (right) {
      poly(ctx, [[352, 172], [352, 234], [392, 234]], '#ffffff');
    } else {
      poly(ctx, [[352, 172], [352, 234], [392, 234]], '#ffffff');
      line(ctx, 362, 196, 380, 196, '#e4572e', 5);
      line(ctx, 362, 212, 386, 212, '#e4572e', 5);
      line(ctx, 362, 228, 390, 228, '#e4572e', 5);
    }
    poly(ctx, [[330, 236], [404, 236], [392, 252], [342, 252]], '#8a5a2b');
    line(ctx, 352, 252, 352, 268, 'rgba(255,255,255,0.4)', 2);
    // Rowboat.
    ellipse(ctx, 486, 306, 34, 10, '#7a5230');
    ellipse(ctx, 486, 302, 30, 7, '#8a5a2b');
    // Dock planks.
    rect(ctx, 40, 300, 220, 12, '#8a5a2b');
    rect(ctx, 40, 316, 220, 12, '#7a5230');
    for (let i = 0; i < 6; i++) line(ctx, 76 + i * 36, 300, 76 + i * 36, 328, '#5d3d1e', 2);
    // Dock posts with lanterns: one lantern is lit on the left only.
    rect(ctx, 56, 272, 8, 30, '#5d3d1e');
    rect(ctx, 204, 272, 8, 30, '#5d3d1e');
    circle(ctx, 60, 264, 9, '#ffd94d');
    circle(ctx, 60, 264, 14, 'rgba(255,217,77,0.35)');
    if (right) {
      circle(ctx, 208, 264, 9, '#5d6b7a');
    } else {
      circle(ctx, 208, 264, 9, '#ffd94d');
      circle(ctx, 208, 264, 14, 'rgba(255,217,77,0.35)');
    }
    // Rope coil on the dock — gone on the right.
    if (!right) {
      circle(ctx, 122, 332, 14, '#c9a86a');
      circle(ctx, 122, 332, 8, '#a87c4f');
      circle(ctx, 122, 332, 3, '#8a5a2b');
    }
    // A fish jumps on the right.
    if (right) {
      ctx.save();
      ctx.translate(302, 252);
      ctx.rotate(-0.5);
      ellipse(ctx, 0, 0, 16, 6, '#9fd8e8');
      poly(ctx, [[-14, 0], [-24, -8], [-24, 8]], '#7fb8cc');
      ctx.restore();
      ellipse(ctx, 302, 268, 12, 3, 'rgba(255,255,255,0.5)');
    }
  },
};

export const SCENES = [PARK, KITCHEN, HARBOR];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
