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
- JavaScript only where required (the red thread scroll animation). Everything else is static HTML and CSS.
- Colors, fonts and spacing come only from tokens in `src/styles/tokens.css`. No raw values in components.
- Inside `.astro` `<style>` blocks, keep each CSS comment on one line. prettier-plugin-astro re-indents the continuation lines of multi-line comments on every run, so `npm run lint` never settles.
- Semantic HTML and accessibility: AA contrast, visible focus states, alt text on images, `aria-hidden="true"` on decorative SVGs, respect `prefers-reduced-motion`.

## Content

- All homepage copy lives in `src/data/site.ts`. No copy is hardcoded in components.
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

## Red thread

- `src/scripts/red-thread.ts` is the only client-side JavaScript. Its geometry tunables (tip position, wobble, ticks, fibres, knots, path shape) are named constants in the block at the top of the file. Colors, core width and reveal timings are the `--thread-*` variables in `tokens.css`.
- Keep the scroll loop free of layout reads: measure in `layout()` (runs on resize and font load only); `update()` may read `window.scrollY` and write transforms and classes only.
- Hidden reveal states exist only under `.is-animated`, which the script sets when motion is allowed. Without JavaScript, or with reduced motion, all content is visible.

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
3. **Images:** replace every placeholder in `src/data/images.ts` (the milestone photos and `ogImage`), with alt text written for the real images.
4. **Copy:** replace the provisional milestone, testimonial and partner texts in `site.ts`, and add partner logos.
5. **Placeholder tags off:** set `SHOW_PLACEHOLDER_TAGS = false` in `site.ts`.
6. **LAUNCHED on:** set `LAUNCHED = true` in `site.ts`.
7. Run `npm run build` and `npm run lint`, then check `dist/robots.txt`, the page `<head>` and a share preview (for example with the Facebook Sharing Debugger).
8. Test the red thread on a real mid-range phone.

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
