# Αφηγηματικά Δρώμενα website

Website for a group of three storytellers from Thessaloniki who perform folk tales, myths and legends for children and adults. Greek first (`<html lang="el">`), English later.

Stack: Astro + TypeScript (strict), plain CSS with design tokens, static output. No Tailwind, no UI libraries, no animation libraries.

The approved homepage design is in `design/`. `design/export/*.html` is a self-unpacking bundle: the page, CSS and fonts are gzip + base64 inside `<script type="__bundler/...">` tags and must be unpacked with a script to be read. `design/references/` holds third-party mood images and is gitignored.

## Commands

- `npm run dev`: local dev server
- `npm run build`: type check (`astro check`) and static build to `dist/`
- `npm run lint`: ESLint and Prettier check
- `npm run format`: Prettier write

## Git

- Never run any git command (no add, commit, push, branch, checkout, stash, reset, status, nothing). The user handles git manually.
- At the end of every step, after build and lint pass, give the user the commands in a code block to run after review, using conventional commit messages:

  ```
  git add .
  git commit -m "type(scope): short description"
  git push
  ```

## Workflow

- Work in small steps and stop after each one so the user can review and commit.
- Run `npm run build` and `npm run lint` at the end of every step and report the result.

## Code

- Minimal, clean code. As few components as possible, no abstractions until they are needed.
- JavaScript only where required, and always as an enhancement (every page works without it). There are three client scripts: the red thread (`red-thread.ts`), the storytellers sequence (`storytellers.ts`) and the invite form (`letter.ts`). Everything else is static HTML and CSS.
- Colors, fonts and spacing come only from tokens in `src/styles/tokens.css`. No raw values in components.
- Inside `.astro` `<style>` blocks, keep each CSS comment on one line. prettier-plugin-astro re-indents the continuation lines of multi-line comments on every run, so `npm run lint` never settles.
- Semantic HTML and accessibility: AA contrast, visible focus states, alt text on images, `aria-hidden="true"` on decorative SVGs, respect `prefers-reduced-motion`.

## Content

- One data file per page: homepage and shared copy (header, footer, routes, flags) live in `src/data/site.ts`; every other page has its own file in `src/data/` (`team.ts` for `/omada`). No copy is hardcoded in components.
- Never use em dashes (—) in any copy. ESLint fails on them.
- Greek labels are stored in normal case and uppercased with CSS (`text-transform: uppercase` under `lang="el"` drops the tonos and keeps the diaeresis).
- Page routes are defined in `site.ts`: `/omada`, `/nea`, `/proskaleste-mas`. "Επικοινωνία" and "Προσκαλέστε μας" both point to `/proskaleste-mas`.
- Placeholder tags ("ΠΡΟΣΩΡΙΝΟ ΚΕΙΜΕΝΟ") are turned on or off everywhere with a single flag in `site.ts`.

## Contact info

- All contact details live in one file only: `src/data/contact.ts` (email, phone, address, city, social links, site URL). Every component reads from there. Nothing is hardcoded anywhere else.
- The current values are placeholders and are marked as such.

## Images

- Every image is currently a placeholder.
- `src/data/images.ts` is the single image registry. Each entry has a key, a `src`, `alt` text and a `placeholder` flag. Components reference images by key only, never by path.
- Real images go in `src/assets/images/`. Each entry's `src` is already the expected file name, so replacing a placeholder means dropping the file in with that name and changing `placeholder: true` to `false`. Nothing else.
- The lookup `imageFile(key)` at the bottom of `images.ts` is the only code that resolves files. `src/components/Photo.astro` renders photos with Astro's `<Picture>` (AVIF/WebP, responsive widths); while `placeholder` is true it shows `src/assets/placeholders/photo.svg` with the alt text as a caption. A missing file with `placeholder: false` fails the build with a clear message.
- The share image (`ogImage`, 1200x630) works the same way. Its placeholder is `src/assets/placeholders/og-image.png` (paper, frame, flower, group name). It was rendered once with the current fonts and is not regenerated if the fonts change. A real image of any size is cropped to 1200x630 at build time.

## Ornaments

- One optimized SVG per ornament in `src/assets/ornaments/`, rendered inline by `src/components/Ornament.astro`.
- Colors come from `currentColor`. No internal IDs (masks are baked into paths), so an ornament can appear several times on a page.
- The hand-printed roughness filter and paper grain are defined once in the base layout and applied with CSS.
- Each ornament renders inside a box of fixed size set in CSS, and the drawing scales to fit that box without distortion. A replacement with slightly different proportions still fits; it just leaves a little empty space on one side.

### How to replace an ornament with your own drawing

1. **Find the file.** Ornaments live in `src/assets/ornaments/`. To replace one, save the new drawing under the **same file name** (lowercase, words joined with hyphens). Current drawings:
   - Storyteller corner drawings (`/omada`): `castle.svg`, `dragon.svg`, `tree.svg` (about square).
   - Oak branch (`/omada` intro): `oak-branch.svg` (detailed, used when shown at least 300px wide) and `oak-branch-small.svg` (simpler, for small sizes). Portrait shape, about 460:640.
   - Places frieze (homepage and `/proskaleste-mas`): `vignette-schools.svg`, `vignette-libraries.svg`, `vignette-squares.svg`, `vignette-festivals.svg`, `vignette-cafes.svg`, `vignette-gardens.svg`, `vignette-cultural-centres.svg` (4:3, about 160x120), plus the thread parts `frieze-ball.svg`, `frieze-knot.svg`, `frieze-thread.svg`, `frieze-end.svg`. The places and which ones the homepage shows (`home: true`) are in `ages` in `site.ts`.
   - Storytellers' bundle (`/proskaleste-mas`): `bundle.svg` (the bundle itself) and the list drawings `bundle-lantern.svg`, `bundle-book.svg`, `bundle-drum.svg`, `bundle-spool.svg`, `bundle-door.svg`, `bundle-moon.svg`, `bundle-listeners.svg`, `bundle-seat.svg` (all square), plus the thread parts `bundle-thread.svg`, `bundle-wave.svg`, `bundle-underline.svg`. Which drawing goes with which line is set in `invite.ts`.
   - `oak-leaf.svg`, `oak-rule.svg`, `flower.svg`, `crest.svg`, `crest-yarn.svg`, `yarn-ball.svg`, `corner.svg`, `corner-small.svg`, `sprig.svg`, `quote-mark.svg`.
2. **One color only.** Draw in a single color. In the SVG every `fill` and `stroke` must be `currentColor` (or `none`), never a color code such as `#A3261C`. The site paints it with its own red, so the color can change in one place.
3. **Keep it simple inside.** No embedded images, no gradients, no `<style>` blocks, no text (convert text to outlines), and no `id` attributes (masks, clip paths and filters need IDs, which break when an ornament appears more than once on a page). Cut-outs should be real holes in the shape, not masks.
4. **viewBox, no fixed size.** The root `<svg>` needs a `viewBox` (for example `viewBox="0 0 120 120"`) and should have no `width` or `height`. Keep the drawing close to the edges of the viewBox; empty margins make it look smaller than its neighbours.
5. **Line weight.** Lines scale with the drawing. A 1px line in a 460px-wide drawing becomes about 0.3px when shown 140px wide and fades away. Check the smallest size it is used at (see the CSS for that ornament).
6. **Export.**
   - Illustrator: File > Export > Export As > SVG. Styling: Presentation Attributes. Font: Convert to Outlines. Images: none. Object IDs: Minimal. Decimal: 2. Minify: on. Responsive: on (removes width/height).
   - Inkscape: File > Save As > Optimized SVG, with "Keep editor data" off and "Remove IDs" on.
   - Figma: select the frame, Export > SVG, with "Include id attribute" off and "Outline text" on.
   - Then clean it: open it in SVGOMG (jakearchibald.github.io/svgomg), turn **"Remove viewBox" off**, and download. This also strips editor metadata, including C2PA "content credentials" blocks that some tools add (they can be 10 KB or more).
   - Finally, in a text editor, replace any remaining color codes with `currentColor`.
7. **Check it.**
   - In a terminal: `grep -nE '#[0-9a-fA-F]{3,6}|id="|<image|<style|width=|height=' src/assets/ornaments/<name>.svg` should print nothing. (A `width` inside a `<rect>` is fine; the root `<svg>` must not have one.)
   - Run `npm run build` and `npm run lint`.
   - Open the page in the browser at desktop and phone widths: the drawing should be red, sharp, and sit inside its box without being cut off.

### The tree on /proskaleste-mas (the exception)

The tree above, beside and below the letter form is **not** an inline ornament. Its six drawings live in `src/assets/tree/` and are used as CSS masks (`mask-image`, with `-webkit-` prefixes for Safari), painted with the site red. Only the variant for the current screen is downloaded.

- Files: `canopy.svg` (1320x300), `trunk.svg` (200x1000), `roots.svg` (1320x160) for screens from 760px; `canopy-small.svg` (366x150), `trunk-narrow.svg` (36x1000), `roots-small.svg` (366x80) for phones. The trunk's centre line sits at x = 100 (desktop) and x = 18 (phone) in all three files of a set, so they join.
- **A replacement works through its shape, not its color.** A mask only reads transparency: everything drawn (in any color) shows as red, everything transparent shows the paper. Keep the background transparent; a white or colored background rectangle would turn the whole box red.
- Because each file is loaded as an image of its own, internal `<mask>`s and `id`s are allowed here (they cannot clash with the page), unlike the inline ornaments.
- The canopy and roots keep their proportions (`contain`, top left). The trunk is stretched to the height of the form (`preserveAspectRatio="none"` in the file); give its lines `vector-effect="non-scaling-stroke"` so they keep their width when stretched.
- The tree has its own grid tracks in `Letter.astro` (canopy row, trunk column, roots row), so it can never cover text or fields. The trunk column is 200/1320 of the width (36/366 on phones), which keeps it lined up with the canopy at every size.
- Check a replacement in Chrome and Safari (or WebKit) at desktop and phone widths.

## Red thread

- `src/scripts/red-thread.ts` (homepage) draws the thread. Its geometry tunables (tip position, wobble, ticks, fibres, knots, path shape) are named constants in the block at the top of the file. Colors, core width and reveal timings are the `--thread-*` variables in `tokens.css`.
- Keep the scroll loop free of layout reads: measure in `layout()` (runs on resize and font load only); `update()` may read `window.scrollY` and write transforms and classes only.
- Hidden reveal states exist only under `.is-animated`, which the script sets when motion is allowed. Without JavaScript, or with reduced motion, all content is visible.

## Storytellers sequence (/omada)

- `src/scripts/storytellers.ts` adds `.is-sequence` to the storytellers section: the frame is pinned with `position: sticky` (native scrolling, no hijacking or snapping), the three profiles share one grid cell and one is shown at a time. Everything styled under `.is-sequence` in `Storytellers.astro` belongs to that mode.
- Scroll position only picks which storyteller is active, with hysteresis at the boundaries. The change itself is a CSS transition with its own timing, so it stays soft on a fast scroll.
- Tunables: scroll distance per storyteller, hysteresis, fit margin and click lock are named constants at the top of `storytellers.ts`; transition durations, delay, easing and rise are the `--sequence-*` variables in `tokens.css`.
- The step buttons are real `<button>`s with `aria-current="step"`; clicking one scrolls smoothly to that storyteller.
- Fallback to the stacked list (the markup as written): no JavaScript, `prefers-reduced-motion`, or a frame taller than the screen. The fit is measured on resize and font load, never in the scroll loop.
- **Bio length: at most 220 characters** (spaces included), and three favourite tales of up to about 35 characters each. Longer text makes the frame too tall for a typical phone (375x667, iPhone Safari 390x664) or a short laptop screen (1366x650), which then get the stacked list. Measured limits were 226 to 247 characters. Very short screens (360x640, 1280x600, iPhone SE in Safari) always get the stacked list.

## Invite form (/proskaleste-mas)

- The letter form in `src/sections/invite/Letter.astro` sends through Web3Forms. Its access key comes from the environment variable `PUBLIC_WEB3FORMS_KEY` (see `.env.example`); `.env` is gitignored. The key is public by design: Web3Forms keys are sent with every submission.
- Without the key the site still builds (with a warning). In production the form then shows the failure message with the group's email; in dev it shows "form not configured".
- **Without JavaScript** the form is a normal POST to Web3Forms. The browser checks the required fields (name, email). On success Web3Forms redirects to `/proskaleste-mas/#letter-sent`, and CSS (`:target`) shows the thank-you panel. On an error Web3Forms shows its own page (accepted).
- **With JavaScript** (`src/scripts/letter.ts`): own validation messages under the line (`aria-invalid`, linked with `aria-describedby`), focus on the first invalid field, sending with `fetch`, a polite live region while sending, a `role="alert"` region for the failure (with the email as an alternative), and focus on the thank-you panel after success. All text comes from `invite.ts`, rendered into the page.
- Email subject: "Πρόσκληση: {name}, {place}" (place = organization and/or city, left out if both are empty); without JavaScript a fixed subject. Field names in the email are the `key`s in `invite.ts` (Greek, readable).
- Spam: the Web3Forms honeypot `botcheck`, a checkbox hidden with `display: none` (not reachable by keyboard or screen readers).
- **Trying the states without a key (dev only):** run `npm run dev` and open `/proskaleste-mas/?simulate=success` or `/proskaleste-mas/?simulate=failure`, fill in name and email and press "Αποστολή": the sending state shows for 1.6 s, then success or failure. The check sits behind `import.meta.env.DEV`, so it is removed from production builds (verify: the built page contains no `simulate`). Without the parameter and without a key, dev shows the "form not configured" message. The thank-you panel without JavaScript can be seen at `/proskaleste-mas/#letter-sent`.

## SEO and launch

- `site` in `astro.config.mjs` comes from `contact.siteUrl`. Canonical URLs, Open Graph URLs, the sitemap and robots.txt are all built from it.
- `BaseLayout.astro` outputs the title, description, canonical, Open Graph and Twitter card tags, favicons (`public/favicon.svg`, `public/apple-touch-icon.png`) and JSON-LD (`PerformingGroup`, values from `contact.ts` and `site.ts` only).
- `@astrojs/sitemap` generates `sitemap-index.xml`. `src/pages/robots.txt.ts` generates `robots.txt`.

### The LAUNCHED flag

`LAUNCHED` in `src/data/site.ts` controls search engine indexing:

- `false` (now): every page has `<meta name="robots" content="noindex, nofollow">` and `robots.txt` disallows everything. Use this for preview deployments with placeholder content.
- `true`: the robots meta tag is removed, `robots.txt` allows everything and references the sitemap, and pages link to the sitemap.

Note: `Disallow: /` stops crawling, which also means crawlers never read the `noindex` tag. A disallowed URL that is linked from elsewhere can still appear in results as a bare link. For previews that must stay private, also use the hosting platform's password protection or preview settings.

### Pre-launch checklist

1. **Domain:** set `siteUrl` in `src/data/contact.ts` to the real domain (it is `https://afigimatika-dromena.example` now).
2. **Contact details:** replace every value marked PLACEHOLDER in `contact.ts`: email, phone, address, city, and the Facebook and Instagram URLs.
3. **Before launch: connect the form** (after the domain and the group's email are final):
   1. Create the key: at https://web3forms.com, enter the group's real email address. The access key arrives by email; submissions will be sent to that address.
   2. Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY=<key>`. Restart `npm run dev`.
   3. On the host: add the same variable `PUBLIC_WEB3FORMS_KEY` in the host's environment variables (build settings), then trigger a new deploy. The key is read at build time, so a deploy is needed after adding or changing it.
   4. Check the build log: the warning "PUBLIC_WEB3FORMS_KEY is not set" must be gone.
   5. On the live site, send a real test letter from a desktop browser and one from a phone (with a different name and place each time).
   6. In the group's inbox check: the subject reads "Πρόσκληση: {name}, {place}" with the real values; the fields appear with their Greek names (Φορέας, Πόλη, Κοινό, Πότε, Μήνυμα, Τηλέφωνο); replying goes to the sender's email.
   7. Check the spam folder. If the test landed there, mark it "not spam" and add the Web3Forms sender to the contacts.
   8. Test once with JavaScript turned off in the browser: after sending, the page must come back with the thank-you panel (this uses the redirect built from `siteUrl`, so it only works on the real domain).
4. **Images:** replace every placeholder in `src/data/images.ts` (the milestone photos, the portraits and `ogImage`), with alt text written for the real images.
5. **Copy:** replace the provisional milestone, testimonial and partner texts in `site.ts`, the texts marked `placeholder` in `team.ts` and `invite.ts` (including every FAQ answer, which must be confirmed with the group), and add partner logos.
6. **Placeholder tags off:** set `SHOW_PLACEHOLDER_TAGS = false` in `site.ts`.
7. **LAUNCHED on:** set `LAUNCHED = true` in `site.ts`.
8. Run `npm run build` and `npm run lint`, then check `dist/robots.txt`, the page `<head>` and a share preview (for example with the Facebook Sharing Debugger).
9. Test the red thread and the storytellers sequence on a real mid-range phone.

## How to change fonts

Fonts are temporary. All font imports and the `--font-display` / `--font-body` variables (with fallback stacks) live together at the top of `src/styles/tokens.css` and nowhere else. No component references a font name directly.

Weights and styles in use: display 400, 400 italic, 500; body 400, 400 italic.

1. Check that the new font has Greek. Its Fontsource page (fontsource.org) must list the **greek** and **greek-ext** subsets. If it does not, do not use it. The verse and quotes may use polytonic Greek, which lives in greek-ext. Locally, `node_modules/@fontsource/<font-name>/` must contain `greek-400.css` and `greek-ext-400.css`.
2. Install the package: `npm install @fontsource/<font-name>`.
3. In `tokens.css`, replace the old `@import` lines at the top with the new package's per-weight files, one line per weight and style in use:
   ```css
   @import "@fontsource/<font-name>/400.css";
   @import "@fontsource/<font-name>/400-italic.css";
   @import "@fontsource/<font-name>/500.css";
   ```
   Use these per-weight files, not the per-subset ones (`greek-400.css`, `latin-400.css`). The per-weight files declare every subset with its own `unicode-range`, so the browser downloads only the greek, greek-ext and latin files the page needs. The per-subset files have no `unicode-range`, and importing several of them makes one subset override the other.
4. Update `--font-display` and/or `--font-body` in `tokens.css` to the new family name (as written in the package's CSS `font-family`). Keep the serif fallback stack after it, for example `"New Font", Georgia, "Times New Roman", serif`.
5. Uninstall the old package: `npm uninstall @fontsource/<old-font-name>`.
6. Run `npm run build` and check the homepage: Greek text with accents, polytonic characters, italics, and uppercase labels (no tonos, diaeresis kept, as in ΠΡΩΤΕΪΝΗ).
