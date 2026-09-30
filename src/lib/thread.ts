/**
 * The look of the red thread, shared by the homepage thread
 * (src/scripts/red-thread.ts, drawn in the browser as the page scrolls) and
 * the cut thread on the 404 page (drawn once at build time): a curve with a
 * hand-drawn wobble, twist ticks across it and a few loose fibres.
 *
 * The texture tunables live here. The homepage path shape (where the thread
 * goes) stays in red-thread.ts; colors and the core width are the --thread-*
 * variables in tokens.css.
 */

/* ==========================================================================
   Tunables
   ========================================================================== */

/** Hand-drawn wobble: sine waves summed along the thread (px, px, radians). */
const WOBBLE = [
  { amplitude: 1.3, wavelength: 61, phase: 0.7 },
  { amplitude: 0.7, wavelength: 23, phase: 2.1 },
];
/** Distance from the start over which the wobble fades in (px). */
const WOBBLE_RAMP = 36;

/** Twist ticks across the thread. */
const TICK_SPACING = 6; // px along the thread
const TICK_HALF_WIDTH = 2.1; // px each side of the centre line
const TICK_SLANT = 1.5; // px the tick leans along the thread
export const TICK_WIDTH = 0.9; // stroke width

/** Loose fibres sticking out of the thread. Larger spacing = fewer fibres. */
const FIBRE_SPACING = 45; // px along the thread
const FIBRE_LENGTH = { min: 3, max: 6.5 }; // px
export const FIBRE_WIDTH = 0.8; // stroke width

/** Resolution of the drawn path (px between points). Lower = smoother, heavier. */
const SAMPLE_STEP = 3;

/* ==========================================================================
   Implementation
   ========================================================================== */

export interface Point {
  x: number;
  y: number;
}

export const round = (v: number) => Math.round(v * 10) / 10;

export function catmullRom(
  a: Point,
  b: Point,
  c: Point,
  d: Point,
  t: number,
): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (p0: number, p1: number, p2: number, p3: number) =>
    0.5 *
    (2 * p1 +
      (p2 - p0) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (3 * p1 - p0 - 3 * p2 + p3) * t3);
  return { x: f(a.x, b.x, c.x, d.x), y: f(a.y, b.y, c.y, d.y) };
}

/** Deterministic pseudo-random numbers, so the fibres look the same on every load. */
export function random(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

/**
 * Draws a thread along `points` (a polyline, at least two points): resampled
 * at an even spacing, with wobble, twist ticks and fibres. Returns the path
 * data of each layer, the length and the vertical extent.
 */
export function drawThread(points: Point[], seed = 7) {
  const end = points[points.length - 1];

  // 1. Resample at an even spacing along the line.
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(
      lengths[i - 1] +
        Math.hypot(
          points[i].x - points[i - 1].x,
          points[i].y - points[i - 1].y,
        ),
    );
  }
  const total = lengths[lengths.length - 1];
  const samples: (Point & { s: number })[] = [];
  for (let s = 0, j = 0; s <= total; s += SAMPLE_STEP) {
    while (j < points.length - 2 && lengths[j + 1] < s) j++;
    const u = Math.min(
      1,
      (s - lengths[j]) / (lengths[j + 1] - lengths[j] || 1),
    );
    samples.push({
      x: points[j].x + (points[j + 1].x - points[j].x) * u,
      y: points[j].y + (points[j + 1].y - points[j].y) * u,
      s,
    });
  }
  samples.push({ ...end, s: total });

  // 2. Wobble, twist ticks and fibres.
  const rand = random(seed);
  const tickEvery = Math.max(1, Math.round(TICK_SPACING / SAMPLE_STEP));
  const fibreEvery = Math.max(1, Math.round(FIBRE_SPACING / SAMPLE_STEP));
  let core = "";
  let ticks = "";
  let fibres = "";
  let minY = Infinity;
  let maxY = -Infinity;
  samples.forEach((p, i) => {
    const p0 = samples[Math.max(0, i - 1)];
    const p1 = samples[Math.min(samples.length - 1, i + 1)];
    const m = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
    const dx = (p1.x - p0.x) / m;
    const dy = (p1.y - p0.y) / m;
    const nx = -dy;
    const ny = dx;
    const ramp = Math.min(1, p.s / WOBBLE_RAMP);
    const w =
      ramp *
      WOBBLE.reduce(
        (sum, wave) =>
          sum + wave.amplitude * Math.sin(p.s / wave.wavelength + wave.phase),
        0,
      );
    const x = p.x + nx * w;
    const y = p.y + ny * w;
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    core += `${i ? "L" : "M"}${round(x)} ${round(y)}`;
    if (i % tickEvery === 0 && i > 1 && i < samples.length - 2) {
      const tx = nx * TICK_HALF_WIDTH + dx * TICK_SLANT;
      const ty = ny * TICK_HALF_WIDTH + dy * TICK_SLANT;
      ticks += `M${round(x - tx)} ${round(y - ty)}L${round(x + tx)} ${round(y + ty)}`;
    }
    if (i % fibreEvery === Math.floor(fibreEvery / 2)) {
      const side = rand() > 0.5 ? 1 : -1;
      const l =
        FIBRE_LENGTH.min + rand() * (FIBRE_LENGTH.max - FIBRE_LENGTH.min);
      fibres +=
        `M${round(x + nx * side * 2)} ${round(y + ny * side * 2)}` +
        `q${round(nx * side * l * 0.5 + dx * 2.5)} ${round(ny * side * l * 0.5 + dy * 2.5)} ` +
        `${round(nx * side * l + dx * 1.2)} ${round(ny * side * l + dy * 1.2)}`;
    }
  });
  return { core, ticks, fibres, length: total, minY, maxY };
}
