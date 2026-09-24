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
- Real images go in `src/assets/images/`. Replacing a placeholder means dropping the real file in that folder and changing one line in `images.ts`. Nothing else.
- Real images are rendered with Astro's `<Image>` / `<Picture>`. While `placeholder` is true, `src/assets/placeholders/photo.svg` is shown instead.

## Ornaments

- One optimized SVG per ornament in `src/assets/ornaments/`, rendered inline by `src/components/Ornament.astro`.
- Colors come from `currentColor`. No internal IDs (masks are baked into paths), so an ornament can appear several times on a page.
- The hand-printed roughness filter and paper grain are defined once in the base layout and applied with CSS.

## How to change fonts

Fonts are temporary. All font imports and the `--font-display` / `--font-body` variables (with fallback stacks) live together at the top of `src/styles/tokens.css` and nowhere else. No component references a font name directly.

1. Check that the new font has Greek. Its Fontsource page (fontsource.org) must list the **greek** and **greek-ext** subsets. If it does not, do not use it. Headings need polytonic support, which lives in greek-ext.
2. Install the package: `npm install @fontsource/<font-name>`, or `npm install @fontsource-variable/<font-name>` for the variable version.
3. In `tokens.css`, replace the old `@import` lines at the top with the new font's per-subset files for each weight and style in use. Import only the greek, greek-ext and latin subsets. Check `node_modules/@fontsource/<font-name>/` for the exact file names (pattern: `<subset>-<weight>.css` and `<subset>-<weight>-italic.css`).
4. Update `--font-display` and/or `--font-body` in `tokens.css` to the new family name. Keep a serif fallback stack after it (for example `"New Font", Georgia, serif`).
5. Uninstall the old package: `npm uninstall @fontsource/<old-font-name>`.
6. Run `npm run build` and check the homepage for Greek text, accents, the diaeresis in uppercase labels and polytonic characters.
