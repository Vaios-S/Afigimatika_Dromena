/**
 * Post pages (/nea/<slug>).
 *
 * Without this script the page is complete: the photo strip scrolls natively
 * (touch, trackpad, arrow keys once focused) and each photo links to its large
 * version; the share row has plain Facebook and email links.
 *
 * With it:
 * - Gallery: a counter and previous/next buttons that turn off at the ends,
 *   and arrow keys, Home and End when the strip is focused. Scrolling stays
 *   native; the script only scrolls to a photo, smoothly unless the visitor
 *   asks for reduced motion.
 * - Enlarged view: clicking a photo opens it in the native <dialog> (Esc or
 *   a click outside closes it, arrow keys change the photo). On closing, the
 *   strip shows the last photo seen and focus returns to it.
 * - Share: "copy link", shown only when the browser can copy.
 * All text comes from the page (data attributes and markup).
 */

/* ==========================================================================
   Tunables
   ========================================================================== */

/** How long "Αντιγράφηκε" stays before the button returns (ms). */
const COPIED_TIME = 2500;

/* ==========================================================================
   Implementation
   ========================================================================== */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

interface Controls {
  prev: HTMLButtonElement;
  next: HTMLButtonElement;
  counter: HTMLElement;
  live: HTMLElement;
}

/** Buttons from one container, counter and live region from another. */
function controlsIn(
  buttons: Element | null | undefined,
  texts: Element | null | undefined,
): Controls | undefined {
  const prev = buttons?.querySelector<HTMLButtonElement>("[data-prev]");
  const next = buttons?.querySelector<HTMLButtonElement>("[data-next]");
  const counter = texts?.querySelector<HTMLElement>("[data-counter]");
  const live = texts?.querySelector<HTMLElement>("[data-live]");
  if (!prev || !next || !counter || !live) return;
  return { prev, next, counter, live };
}

/** Shows photo `index` of `total` on a set of controls. */
function showPosition(
  controls: Controls,
  index: number,
  total: number,
  status: string,
  announce: boolean,
) {
  const { prev, next, counter, live } = controls;
  const focused = document.activeElement;
  prev.disabled = index === 0;
  next.disabled = index === total - 1;
  // A button that turns off while focused hands focus to the other one.
  if (focused === prev && prev.disabled) next.focus();
  if (focused === next && next.disabled) prev.focus();
  counter.textContent = `${String(index + 1)} / ${String(total)}`;
  // Silent updates (first render, returning from the enlarged view) clear the
  // live region, so it never holds an old position.
  live.textContent = announce
    ? status
        .replace("{current}", String(index + 1))
        .replace("{total}", String(total))
    : "";
}

function setupGallery(section: HTMLElement) {
  const strip = section.querySelector<HTMLElement>("[data-strip]");
  const items = [...section.querySelectorAll<HTMLElement>("[data-item]")];
  const links = [
    ...section.querySelectorAll<HTMLAnchorElement>("[data-item] > a"),
  ];
  const head = section.querySelector(".head");
  const buttons = section.querySelector<HTMLElement>("[data-controls]");
  const dialog = section.querySelector<HTMLDialogElement>("[data-lightbox]");
  const image = dialog?.querySelector<HTMLImageElement>(
    "[data-lightbox-image]",
  );
  const caption = dialog?.querySelector<HTMLElement>("[data-lightbox-caption]");
  const close = dialog?.querySelector<HTMLButtonElement>("[data-close]");
  const stripControls = controlsIn(buttons, head);
  const dialogControls = controlsIn(dialog, dialog);
  if (
    !strip ||
    !items.length ||
    links.length !== items.length ||
    !buttons ||
    !stripControls ||
    !dialog ||
    !dialogControls ||
    !image ||
    !caption ||
    !close
  )
    return;

  const total = items.length;
  const last = total - 1;
  const status = section.dataset.status ?? "";
  let index = 0; // photo at the start of the strip
  let open = 0; // photo in the enlarged view
  let step = 1; // distance between two photos in the strip (px)

  /* Strip ------------------------------------------------------------------ */

  const measure = () => {
    step = total > 1 ? items[1].offsetLeft - items[0].offsetLeft : 1;
  };

  const scrollTo = (target: number, instant = false) => {
    strip.scrollTo({
      left: items[target].offsetLeft - items[0].offsetLeft,
      behavior: instant || reducedMotion.matches ? "auto" : "smooth",
    });
  };

  const go = (target: number) => {
    const next = clamp(target, last);
    if (next === index) return;
    index = next;
    showPosition(stripControls, index, total, status, true);
    scrollTo(index);
  };

  let frame = 0;
  strip.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = clamp(Math.round(strip.scrollLeft / step), last);
        if (current === index) return;
        index = current;
        showPosition(stripControls, index, total, status, true);
      });
    },
    { passive: true },
  );

  strip.addEventListener("keydown", (event) => {
    if (event.target !== strip) return;
    const keys: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key]);
  });

  stripControls.prev.addEventListener("click", () => {
    go(index - 1);
  });
  stripControls.next.addEventListener("click", () => {
    go(index + 1);
  });

  measure();
  new ResizeObserver(measure).observe(strip);
  showPosition(stripControls, index, total, status, false);
  buttons.hidden = false;
  stripControls.counter.hidden = false;

  /* Enlarged view ---------------------------------------------------------- */

  const show = (target: number, announce: boolean) => {
    open = clamp(target, last);
    const link = links[open];
    image.src = link.href;
    image.alt = link.dataset.alt ?? "";
    const width = Number(link.dataset.width);
    const height = Number(link.dataset.height);
    image.width = width;
    image.height = height;
    image.style.setProperty("--ratio", String(width / height));
    caption.textContent =
      items[open].querySelector("figcaption")?.textContent ?? "";
    showPosition(dialogControls, open, total, status, announce);
  };

  links.forEach((link, i) => {
    link.addEventListener("click", (event) => {
      // Let a new-tab click (Ctrl, Cmd, Shift, middle button) through.
      if (event.button !== 0 || event.ctrlKey || event.metaKey) return;
      if (event.shiftKey || event.altKey) return;
      event.preventDefault();
      show(i, false);
      dialog.showModal();
    });
  });

  dialogControls.prev.addEventListener("click", () => {
    show(open - 1, true);
  });
  dialogControls.next.addEventListener("click", () => {
    show(open + 1, true);
  });
  close.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(open - 1, true);
    else if (event.key === "ArrowRight") show(open + 1, true);
    else return;
    event.preventDefault();
  });

  // A click on the dark area around the photo closes the view.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    if (open !== index) {
      index = open;
      showPosition(stripControls, index, total, status, false);
      scrollTo(index, true);
    }
    links[open].focus();
  });
}

function setupCopy(button: HTMLButtonElement) {
  const text = button.querySelector<HTMLElement>("[data-copy-text]");
  if (!text || !window.isSecureContext || !("clipboard" in navigator)) return;
  const label = text.textContent;
  const copied = button.dataset.copied ?? label;
  let timer = 0;

  button.addEventListener("click", () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url).then(
      () => {
        button.classList.add("is-copied");
        text.textContent = copied;
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          button.classList.remove("is-copied");
          text.textContent = label;
        }, COPIED_TIME);
      },
      () => undefined, // copying refused: the other share links remain
    );
  });
  button.hidden = false;
}

const gallery = document.querySelector<HTMLElement>("[data-gallery]");
if (gallery) setupGallery(gallery);

const copyButton = document.querySelector<HTMLButtonElement>("[data-copy]");
if (copyButton) setupCopy(copyButton);
