/**
 * The storytellers sequence on /omada.
 *
 * Turns the stacked list into a pinned frame (native scrolling with
 * position: sticky) that shows one storyteller at a time. Scroll position only
 * decides WHICH storyteller is active; the change itself is a CSS transition
 * with its own duration and easing (tokens.css, "Storytellers sequence"), so
 * it stays soft however fast the page is scrolled.
 *
 * - No JavaScript, reduced motion, or a frame taller than the screen: the
 *   stacked list stays (the class .is-sequence is never added).
 * - The class is added before the first paint by a small inline script in
 *   Storytellers.astro, with the same fit test, so the page does not shift
 *   when this script loads. This script keeps that choice: it re-measures
 *   when sizes change, falls back to the stacked list if the frame stops
 *   fitting, and chooses again only when the screen's width or the motion
 *   preference changes.
 * - Step buttons (aria-current="step") scroll smoothly to a storyteller.
 *
 * Performance: everything is measured in layout(), which runs only when sizes
 * change (resize, fonts). The scroll loop reads window.scrollY and writes a
 * class and an attribute only when the active storyteller changes.
 */

/* ==========================================================================
   Tunables: adjust the feel here without touching the logic.
   Scroll distance per storyteller, fit margin, transition duration, easing
   and rise distance are in tokens.css ("Storytellers sequence"), because the
   first paint needs them too.
   ========================================================================== */

/**
 * How far past a boundary the page must scroll before switching, as a share
 * of one storyteller's scroll distance. Prevents flicker when stopping near a
 * boundary; larger values switch later.
 */
const HYSTERESIS = 0.12;

/** After a step button is clicked, ignore scroll-driven changes for up to this long (ms). */
const CLICK_LOCK = 1500;

/* ==========================================================================
   Implementation
   ========================================================================== */

interface Parts {
  section: HTMLElement;
  /** Sticky full-screen container. */
  pin: HTMLElement;
  /** Frame plus step buttons: what has to fit on screen. */
  stage: HTMLElement;
  people: HTMLElement[];
  steps: HTMLButtonElement[];
}

function init({ section, pin, stage, people, steps }: Parts) {
  const count = people.length;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // The inline script in Storytellers.astro has already chosen the mode
  // before the first paint. Cached by measure(), read by update().
  let enabled = section.classList.contains("is-sequence");
  let top = 0;
  let span = 1;
  let active = -1;
  let lock: number | null = null;
  let lockTimer = 0;

  function setActive(index: number) {
    if (index === active) return;
    active = index;
    people.forEach((person, i) =>
      person.classList.toggle("is-active", i === index),
    );
    steps.forEach((step, i) => {
      if (i === index) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
  }

  /** Position in the sequence: 0 at the start, `count` at the end. */
  function position() {
    const progress = Math.min(1, Math.max(0, (window.scrollY - top) / span));
    return Math.min(progress * count, count - 1e-6);
  }

  /** Does the frame fit on screen? Measured in the current mode. */
  function fits() {
    const margin = parseFloat(
      getComputedStyle(section).getPropertyValue("--sequence-fit-margin"),
    );
    return stage.offsetHeight + 2 * margin <= pin.clientHeight;
  }

  /** Sequence mode: where it starts and how far it scrolls. */
  function measure() {
    top = section.getBoundingClientRect().top + window.scrollY;
    span = Math.max(1, section.offsetHeight - pin.clientHeight);
    active = -1;
    setActive(Math.floor(position()));
  }

  /**
   * Chooses the mode again (the screen's width or the motion preference
   * changed). Trying sequence mode to measure it can register as a layout
   * shift, so this runs only on those changes, never on load.
   */
  function decide() {
    const scrollY = window.scrollY;
    section.classList.add("is-sequence");
    enabled = !reducedMotion.matches && fits();
    section.classList.toggle("is-sequence", enabled);
    // Switching modes changes the page height; keep the reader where they were.
    if (window.scrollY !== scrollY)
      window.scrollTo({ top: scrollY, behavior: "instant" });
    if (enabled) measure();
  }

  /** Sizes changed (fonts, images, screen height): keep the mode, re-measure. */
  function layout() {
    if (!enabled) return;
    if (fits()) measure();
    else decide();
  }

  function update() {
    if (!enabled) return;
    const at = position();
    if (lock !== null) {
      if (Math.floor(at) !== lock) return;
      lock = null;
    }
    let next = active;
    if (at >= active + 1 + HYSTERESIS)
      next = Math.min(count - 1, Math.floor(at - HYSTERESIS));
    else if (at < active - HYSTERESIS)
      next = Math.max(0, Math.floor(at + HYSTERESIS));
    setActive(next);
  }

  steps.forEach((step, i) =>
    step.addEventListener("click", () => {
      lock = i;
      setActive(i);
      clearTimeout(lockTimer);
      lockTimer = window.setTimeout(() => {
        lock = null;
        update();
      }, CLICK_LOCK);
      window.scrollTo({
        top: top + ((i + 0.5) / count) * span,
        behavior: "smooth",
      });
    }),
  );

  // Scroll: at most one update per frame, no layout reads.
  let frame = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
    },
    { passive: true },
  );
  window.addEventListener("scrollend", () => {
    lock = null;
    update();
  });

  // Size changes: re-measure once, on the next frame. A new screen width or
  // motion preference re-chooses the mode; a height-only change (a phone's
  // address bar hiding while scrolling) never switches it mid-scroll.
  let layoutFrame = 0;
  let rechoose = false;
  let width = window.innerWidth;
  const schedule = (choose = false) => {
    rechoose ||= choose;
    if (!layoutFrame) {
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = 0;
        if (rechoose) decide();
        else layout();
        rechoose = false;
      });
    }
  };
  window.addEventListener(
    "resize",
    () => {
      const widthChanged = window.innerWidth !== width;
      width = window.innerWidth;
      schedule(widthChanged);
    },
    { passive: true },
  );
  new ResizeObserver(() => {
    schedule();
  }).observe(document.body);
  void document.fonts.ready.then(() => {
    schedule();
  });
  reducedMotion.addEventListener("change", () => {
    schedule(true);
  });

  layout();
}

const section = document.querySelector<HTMLElement>("[data-storytellers]");
const pin = section?.querySelector<HTMLElement>(".pin");
const stage = section?.querySelector<HTMLElement>(".stage");
const people = [
  ...(section?.querySelectorAll<HTMLElement>("[data-storyteller]") ?? []),
];
const steps = [
  ...(section?.querySelectorAll<HTMLButtonElement>("[data-step]") ?? []),
];
if (section && pin && stage && people.length > 1) {
  init({ section, pin, stage, people, steps });
}
