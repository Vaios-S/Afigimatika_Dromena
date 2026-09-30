/**
 * The red thread.
 *
 * Draws a thread from the hero's yarn ball, through a knot beside each
 * milestone card, to a bow above the closing line. The thread is revealed as
 * the page scrolls (and hidden again when scrolling back up); cards and verse
 * lines fade in as the thread reaches them.
 *
 * - No JavaScript: nothing here runs, all content is visible, no thread.
 * - prefers-reduced-motion: the thread is drawn in full and nothing animates.
 *
 * Performance: all measuring happens in layout(), which runs only when the
 * page size changes (resize, fonts, images). The scroll loop reads
 * window.scrollY, then writes two transforms: the thread sits in a clipping
 * window whose edge follows the tip, which the compositor can move without
 * repainting. Class changes are written only when a state actually flips.
 *
 * Colors, the thread's core width and all reveal timings are CSS variables in
 * src/styles/tokens.css (the "Red thread" block).
 */

import {
  catmullRom,
  drawThread,
  FIBRE_WIDTH,
  round,
  TICK_WIDTH,
  type Point,
} from "../lib/thread";

/* ==========================================================================
   Tunables: adjust the feel here without touching the algorithm.
   The thread's texture (wobble, twist ticks, fibres) is in src/lib/thread.ts.
   ========================================================================== */

/** Where the thread's tip sits, as a fraction of the viewport height (0 = top). */
const TIP = 0.62;

/** Verse lines appear once the intro's top passes this fraction of the viewport. */
const VERSE_TRIGGER = 0.85;

/** Knots beside each card: loop radius, dot radius (px). */
const KNOT = {
  desktop: { loop: 13, dot: 4.2 },
  mobile: { loop: 9, dot: 3.2 },
};

/** Path shape (px). */
const SHAPE = {
  /** Straight drop below the yarn ball before the thread starts curving. */
  startDrop: { desktop: 46, mobile: 20 },
  /** Desktop: how far right of the verse block the thread passes, but never
   *  closer than edgeMargin to the right edge (tablets). */
  introClearance: 70,
  edgeMargin: 32,
  /** Knot position: below the card's top edge, and (desktop) beside the card.
   *  Beside-distance and swing are capped to a share of the gap between the
   *  card columns, so narrower screens keep the thread inside the gap. */
  knotBelowCardTop: 46,
  knotBesideCard: 48,
  knotBesideMaxShare: 0.25,
  /** Sideways swing between knots: desktop ± px, mobile [even, odd] px. */
  swing: { desktop: 80, mobile: [-7, 9] },
  swingMaxShare: 0.5,
  /** Desktop: sideways swing on the last stretch, before the bow. */
  endSwing: 90,
  /** Mobile: the thread's x position in the left gutter. */
  mobileX: 26,
  /** The bow sits this far above the closing line. */
  endAboveText: { desktop: 64, mobile: 34 },
  /** Bow size relative to the desktop bow. */
  bowScale: { desktop: 1, mobile: 0.7 },
};

/** Must match the layout breakpoint in RedThread.astro. */
const MOBILE_QUERY = "(width < 760px)";

/* ==========================================================================
   Implementation
   ========================================================================== */

interface Waypoint extends Point {
  /** Set on knot waypoints: which side the loop bulges to (1 = +x). */
  knot?: 1 | -1;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const LOOP_POINTS = 40;

const BOW_MARKUP = `
  <path class="thread-line" stroke-width="4" d="M0 0C-12-18-40-22-44-6-47 8-20 8 0 0ZM0 0C12-18 40-22 44-6 47 8 20 8 0 0Z"/>
  <path class="thread-twist" stroke-width="0.9" d="M-30-10-26-4M-20-12-16-5M30-10 26-4M20-12 16-5"/>
  <path class="thread-line" stroke-width="4" d="M-2 2C-8 16-18 28-30 40M2 2C8 16 16 30 30 38"/>
  <ellipse class="thread-fill" rx="6" ry="7"/>`;

/** Offset of an element from `root`, ignoring transforms (cards may be mid-reveal). */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: Element | null = el;
  while (node instanceof HTMLElement && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return { x, y };
}

interface Parts {
  section: HTMLElement;
  intro: HTMLElement;
  ending: HTMLElement;
  cards: HTMLElement[];
  /** Yarn ball ornaments (desktop crest and mobile ball); the visible one is used. */
  balls: SVGSVGElement[];
}

function init({ section, intro, ending, cards, balls }: Parts) {
  // Thread: a clipping window (outer) holding the drawing (inner svg).
  const clip = document.createElement("div");
  clip.className = "thread";
  clip.setAttribute("aria-hidden", "true");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("thread-svg");
  svg.innerHTML =
    '<path class="thread-line thread-core"/><path class="thread-twist"/>' +
    '<path class="thread-line thread-fibres"/><path class="thread-fill"/>';
  const [core, ticks, fibres, knots] = [...svg.children] as SVGPathElement[];
  ticks.setAttribute("stroke-width", String(TICK_WIDTH));
  fibres.setAttribute("stroke-width", String(FIBRE_WIDTH));
  clip.append(svg);

  const bow = document.createElementNS(SVG_NS, "svg");
  bow.classList.add("thread-bow");
  bow.setAttribute("aria-hidden", "true");
  bow.setAttribute("viewBox", "-50 -26 100 70");
  bow.innerHTML = BOW_MARKUP;

  section.prepend(clip, bow);

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = matchMedia(MOBILE_QUERY);

  // Cached by layout(), read by update().
  let sectionTop = 0;
  let originY = 0;
  let height = 0;
  let introTop = 0;
  let endY = 0;
  let knotYs: number[] = [];
  let viewport = window.innerHeight;
  let drawn = -1;
  let ready = false;

  function layout() {
    const mobile = mobileQuery.matches;
    const knot = mobile ? KNOT.mobile : KNOT.desktop;
    const sectionRect = section.getBoundingClientRect();
    sectionTop = sectionRect.top + window.scrollY;
    const width = section.clientWidth;

    // Start just under the visible yarn ball (desktop crest or mobile ball).
    const ball = balls.find((b) => b.getBoundingClientRect().width > 0);
    if (!ball) return;
    const ballRect = ball.getBoundingClientRect();
    const ballRadius = ballRect.width * Number(ball.dataset.threadBall);
    const start: Point = {
      x: ballRect.left + ballRect.width / 2 - sectionRect.left,
      y: ballRect.top + ballRect.height / 2 - sectionRect.top + ballRadius - 3,
    };

    const introPos = offsetWithin(intro, section);
    introTop = introPos.y;
    const introH = intro.offsetHeight;

    const waypoints: Waypoint[] = [
      start,
      {
        x: start.x,
        y:
          start.y + (mobile ? SHAPE.startDrop.mobile : SHAPE.startDrop.desktop),
      },
    ];
    if (mobile) {
      const x = SHAPE.mobileX;
      waypoints.push(
        { x: x + 34, y: introPos.y - 20 },
        { x, y: introPos.y + 36 },
        { x: x + 7, y: introPos.y + introH * 0.7 },
      );
    } else {
      waypoints.push({
        x: Math.min(
          introPos.x + intro.offsetWidth + SHAPE.introClearance,
          width - SHAPE.edgeMargin,
        ),
        y: introPos.y + introH * 0.45,
      });
    }

    // Gap between the two card columns (desktop), which bounds knots and swing.
    const gap =
      cards.length > 1
        ? cards[1].offsetLeft - (cards[0].offsetLeft + cards[0].offsetWidth)
        : Infinity;
    const beside = Math.min(
      SHAPE.knotBesideCard,
      gap * SHAPE.knotBesideMaxShare,
    );
    const swingX = Math.min(SHAPE.swing.desktop, gap * SHAPE.swingMaxShare);
    const endSwingX = Math.min(SHAPE.endSwing, gap * SHAPE.swingMaxShare);

    knotYs = cards.map((card, i) => {
      const pos = offsetWithin(card, section);
      const y = pos.y + SHAPE.knotBelowCardTop;
      let k: Waypoint;
      if (mobile) k = { x: SHAPE.mobileX, y, knot: 1 };
      else if (i % 2 === 0)
        k = { x: pos.x + card.offsetWidth + beside, y, knot: 1 };
      else k = { x: pos.x - beside, y, knot: -1 };
      const prev = waypoints[waypoints.length - 1];
      const swing = mobile
        ? SHAPE.swing.mobile[i % 2]
        : i % 2
          ? swingX
          : -swingX;
      waypoints.push(
        { x: (prev.x + k.x) / 2 + swing, y: (prev.y + k.y) / 2 },
        k,
      );
      return y;
    });

    const endPos = offsetWithin(ending, section);
    const end: Point = mobile
      ? { x: SHAPE.mobileX + 18, y: endPos.y - SHAPE.endAboveText.mobile }
      : { x: start.x, y: endPos.y - SHAPE.endAboveText.desktop };
    endY = end.y;
    const last = waypoints[waypoints.length - 1];
    waypoints.push(
      {
        x: mobile ? SHAPE.mobileX + 6 : (last.x + end.x) / 2 + endSwingX,
        y: (last.y + end.y) / 2,
      },
      end,
    );

    // 1. Smooth curve through the waypoints, with a loop at every knot.
    const points: Point[] = [];
    const knotPoints: Point[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i - 1] ?? waypoints[i];
      const b = waypoints[i];
      const c = waypoints[i + 1];
      const d = waypoints[i + 2] ?? c;
      const n = Math.max(6, Math.ceil(Math.hypot(c.x - b.x, c.y - b.y) / 4));
      for (let s = 0; s < n; s++) points.push(catmullRom(a, b, c, d, s / n));
      if (c.knot) {
        const q = points[points.length - 1];
        const m = Math.hypot(c.x - q.x, c.y - q.y) || 1;
        const dx = (c.x - q.x) / m;
        const dy = (c.y - q.y) / m;
        const flip = -dy * c.knot < 0 ? -1 : 1;
        const nx = -dy * flip;
        const ny = dx * flip;
        const r = knot.loop;
        const cx = c.x + nx * r;
        const cy = c.y + ny * r;
        for (let j = 0; j < LOOP_POINTS; j++) {
          const th = (j / LOOP_POINTS) * Math.PI * 2;
          points.push({
            x: cx + r * (-nx * Math.cos(th) + dx * Math.sin(th)),
            y: cy + r * (-ny * Math.cos(th) + dy * Math.sin(th)),
          });
        }
        knotPoints.push(c);
      }
    }
    points.push(end);

    // 2. Wobble, twist ticks and fibres (src/lib/thread.ts).
    const {
      core: coreD,
      ticks: ticksD,
      fibres: fibresD,
      minY,
      maxY,
    } = drawThread(points);
    const dot = knot.dot;
    const knotsD = knotPoints
      .map(
        (k) =>
          `M${round(k.x - dot)} ${round(k.y)}a${dot} ${dot} 0 1 0 ${2 * dot} 0a${dot} ${dot} 0 1 0 ${-2 * dot} 0Z`,
      )
      .join("");

    // 4. Write the drawing and size the clipping window around it.
    originY = Math.floor(minY - 20);
    height = Math.ceil(maxY + 20) - originY;
    core.setAttribute("d", coreD);
    ticks.setAttribute("d", ticksD);
    fibres.setAttribute("d", fibresD);
    knots.setAttribute("d", knotsD);
    svg.setAttribute("viewBox", `0 ${originY} ${width} ${height}`);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    clip.style.top = `${originY}px`;
    clip.style.height = `${height}px`;

    const scale = mobile ? SHAPE.bowScale.mobile : SHAPE.bowScale.desktop;
    bow.style.width = `${100 * scale}px`;
    bow.style.left = `${end.x - 50 * scale}px`;
    bow.style.top = `${end.y - 26 * scale}px`;

    drawn = -1;
    ready = true;
  }

  /** Moves the clipping window so everything above `visible` px is shown. */
  function reveal(visible: number) {
    const v = Math.round(Math.max(0, Math.min(height, visible)) * 2) / 2;
    if (v === drawn) return;
    drawn = v;
    clip.style.transform = `translate3d(0, ${v - height}px, 0)`;
    svg.style.transform = `translate3d(0, ${height - v}px, 0)`;
  }

  function update() {
    if (!ready) return;
    if (reducedMotion.matches) {
      reveal(height);
      return;
    }
    const scrollY = window.scrollY;
    const tip = scrollY + viewport * TIP - sectionTop;
    reveal(tip - originY);
    cards.forEach((card, i) =>
      card.classList.toggle("is-shown", tip >= knotYs[i] - 2),
    );
    intro.classList.toggle(
      "is-shown",
      scrollY + viewport * VERSE_TRIGGER >= sectionTop + introTop,
    );
    const atEnd = tip >= endY - 2;
    ending.classList.toggle("is-shown", atEnd);
    bow.classList.toggle("is-shown", atEnd);
  }

  // Scroll: at most one update per frame, no layout reads.
  let frame = 0;
  const onScroll = () => {
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }
  };

  // Layout changes: re-measure once, on the next frame.
  let layoutFrame = 0;
  const scheduleLayout = () => {
    if (!layoutFrame) {
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = 0;
        layout();
        update();
      });
    }
  };

  function applyMotionPreference() {
    // Hidden states (cards, verse, ending) only exist while this class is set.
    section.classList.toggle("is-animated", !reducedMotion.matches);
    bow.classList.toggle("is-shown", reducedMotion.matches);
    drawn = -1;
    update();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      viewport = window.innerHeight; // mobile toolbars change this; geometry is unaffected
      onScroll();
    },
    { passive: true },
  );
  new ResizeObserver(scheduleLayout).observe(document.body);
  document.fonts.ready.then(scheduleLayout);
  reducedMotion.addEventListener("change", applyMotionPreference);
  mobileQuery.addEventListener("change", scheduleLayout);

  applyMotionPreference();
}

const section = document.querySelector<HTMLElement>("[data-red-thread]");
const intro = section?.querySelector<HTMLElement>("[data-thread-intro]");
const ending = section?.querySelector<HTMLElement>("[data-thread-end]");
const cards = [
  ...(section?.querySelectorAll<HTMLElement>("[data-thread-card]") ?? []),
];
const balls = [
  ...document.querySelectorAll<SVGSVGElement>("[data-thread-ball]"),
];
if (section && intro && ending && cards.length && balls.length) {
  init({ section, intro, ending, cards, balls });
}
