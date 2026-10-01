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
- JavaScript only where required, and always as an enhancement (every page works without it). There are four client scripts: the red thread (`red-thread.ts`), the storytellers sequence (`storytellers.ts`), the invite form (`letter.ts`) and the post page gallery and copy link (`post.ts`). Everything else is static HTML and CSS.
- Colors, fonts and spacing come only from tokens in `src/styles/tokens.css`. No raw values in components.
- Inside `.astro` `<style>` blocks, keep each CSS comment on one line. prettier-plugin-astro re-indents the continuation lines of multi-line comments on every run, so `npm run lint` never settles.
- Semantic HTML and accessibility: AA contrast, visible focus states, alt text on images, `aria-hidden="true"` on decorative SVGs, respect `prefers-reduced-motion`.

## Content

- One data file per page: homepage and shared copy (header, footer, routes, flags) live in `src/data/site.ts`; every other page has its own file in `src/data/` (`team.ts` for `/omada`, `invite.ts` for `/proskaleste-mas`, `news.ts` for `/nea` and the post pages, `not-found.ts` for the 404 page). No copy is hardcoded in components. Posts and events are content, not copy: see "News and events" below.
- Never use em dashes (—) in any copy. ESLint fails on them.
- Greek labels are stored in normal case and uppercased with CSS (`text-transform: uppercase` under `lang="el"` drops the tonos and keeps the diaeresis).
- Page routes are defined in `site.ts`: `/omada`, `/nea`, `/proskaleste-mas`. "Επικοινωνία" and "Προσκαλέστε μας" both point to `/proskaleste-mas`.
- Placeholder tags ("ΠΡΟΣΩΡΙΝΟ ΚΕΙΜΕΝΟ") are turned on or off everywhere with a single flag in `site.ts`.
- **Footer invitation** ("Να φέρουμε ένα παραμύθι… στον δικό σας χώρο;" with the button): shown only on the homepage and `/omada`. It is off by default; a page opts in with `footerCta` on `BaseLayout`, which passes it to `Footer` as `cta`. Every other page (`/nea` and all its listing and post pages, `/proskaleste-mas`, the 404) has no invitation and needs no prop.

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
   - Large dragon (`/nea` intro): `dragon-corner.svg` (desktop, shown up to 560x480) and `dragon-corner-small.svg` (phones, 170x146, heavier line). Both 560:480. A different drawing from the storytellers' `dragon.svg`.
   - Places frieze (homepage and `/proskaleste-mas`): `vignette-schools.svg`, `vignette-libraries.svg`, `vignette-squares.svg`, `vignette-festivals.svg`, `vignette-cafes.svg`, `vignette-gardens.svg`, `vignette-cultural-centres.svg` (4:3, about 160x120), plus the thread parts `frieze-ball.svg`, `frieze-knot.svg`, `frieze-thread.svg`, `frieze-end.svg`. The places and which ones the homepage shows (`home: true`) are in `ages` in `site.ts`.
   - Storytellers' bundle (`/proskaleste-mas`): `bundle.svg` (the bundle itself) and the list drawings `bundle-lantern.svg`, `bundle-book.svg`, `bundle-drum.svg`, `bundle-spool.svg`, `bundle-door.svg`, `bundle-moon.svg`, `bundle-listeners.svg`, `bundle-seat.svg` (all square), plus the thread parts `bundle-thread.svg`, `bundle-wave.svg`, `bundle-underline.svg`. Which drawing goes with which line is set in `invite.ts`.
   - Post title frame (`/nea/<slug>`): `nouveau-top.svg` (1100x150) and `nouveau-base.svg` (1100x110) with `nouveau-stem.svg` (220x1000) for screens from 760px; `nouveau-top-small.svg` (350x96), `nouveau-base-small.svg` (350x40) and `nouveau-stem-slim.svg` (36x1000) for phones. The stems stretch to the title's height: they keep `preserveAspectRatio="none"` on the root and `vector-effect="non-scaling-stroke"` on their lines (the only ornaments allowed these). The right stem is the left one mirrored by CSS. The stem lines must meet the ends of the top and base: at x = 128, 142, 188 (dotted) and 200 on the left (mirrored on the right) for desktop, and x = 18 for phones.
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

- `src/scripts/red-thread.ts` (homepage) draws the thread. Its geometry tunables (tip position, knots, path shape) are named constants in the block at the top of the file. The thread's texture (wobble, twist ticks, fibres) is drawn by `drawThread()` in `src/lib/thread.ts`, with its own tunables at the top; the 404 page uses it too, so both threads look the same. Colors, core width and reveal timings are the `--thread-*` variables in `tokens.css`.
- Keep the scroll loop free of layout reads: measure in `layout()` (runs on resize and font load only); `update()` may read `window.scrollY` and write the clip-path and classes only.
- No layout shift (CLS): the thread's box (`.thread`, covering the section plus `--thread-overhang` above it for the start under the yarn ball) and the bow are in the markup of `RedThread.astro`, sized by CSS from the first paint. The script only fills in the paths, reveals the thread with a rectangular `clip-path` and places the bow with a transform. Never create, move or resize them from the script: a moving box this tall counts as a full-screen shift.
- Hidden reveal states exist only under `.is-animated`, which the script sets when motion is allowed. Without JavaScript, or with reduced motion, all content is visible.

## Storytellers sequence (/omada)

- `.is-sequence` on the storytellers section turns on the sequence: the frame is pinned with `position: sticky` (native scrolling, no hijacking or snapping), the three profiles share one grid cell and one is shown at a time. Everything styled under `.is-sequence` in `Storytellers.astro` belongs to that mode.
- Scroll position only picks which storyteller is active, with hysteresis at the boundaries. The change itself is a CSS transition with its own timing, so it stays soft on a fast scroll.
- **No layout shift:** a few lines of inline script right after the section in `Storytellers.astro` add `.is-sequence` before the first paint, when motion is allowed and the frame fits the screen. `storytellers.ts` (a module, which runs later) keeps that choice: it re-measures when sizes change, falls back to the stacked list if the frame stops fitting, and chooses again only when the screen's width or the motion preference changes, never on load. The first storyteller and step are marked active in the markup, and the section's scroll length comes from CSS (`--sequence-count` × `--sequence-scroll-step`), so the first frame is already the final layout.
- Tunables: hysteresis and click lock are named constants at the top of `storytellers.ts`. Scroll distance per storyteller (`--sequence-scroll-step`), fit margin (`--sequence-fit-margin`, in px because the scripts read it), transition durations, delay, easing and rise are the `--sequence-*` variables in `tokens.css`, because the first paint needs them too.
- The step buttons are real `<button>`s with `aria-current="step"`; clicking one scrolls smoothly to that storyteller.
- Fallback to the stacked list (the markup as written): no JavaScript, `prefers-reduced-motion`, or a frame taller than the screen. The fit is measured before the first paint and when sizes change, never in the scroll loop.
- **Bio length: at most 220 characters** (spaces included), and three favourite tales of up to about 35 characters each. Longer text makes the frame too tall for a typical phone (375x667, iPhone Safari 390x664) or a short laptop screen (1366x650), which then get the stacked list. Measured limits were 226 to 247 characters. Very short screens (360x640, 1280x600, iPhone SE in Safari) always get the stacked list.

## Invite form (/proskaleste-mas)

- No footer invitation on this page (see "Footer invitation" under Content).
- The FAQ uses native `<details>`/`<summary>`, so it works without JavaScript. The oak leaf turns 90° when a question opens (`--duration-turn`); reduced motion removes the animation. A question is removed by deleting its entry in `invite.ts`; the placeholder tag shows while any answer is marked `placeholder`.

- The letter form in `src/sections/invite/Letter.astro` sends through Web3Forms. Its access key comes from the environment variable `PUBLIC_WEB3FORMS_KEY` (see `.env.example`); `.env` is gitignored. The key is public by design: Web3Forms keys are sent with every submission.
- Without the key the site still builds (with a warning). In production the form then shows the failure message with the group's email; in dev it shows "form not configured".
- **Without JavaScript** the form is a normal POST to Web3Forms. The browser checks the required fields (name, email). On success Web3Forms redirects to `/proskaleste-mas/#letter-sent`, and CSS (`:target`) shows the thank-you panel. On an error Web3Forms shows its own page (accepted).
- **With JavaScript** (`src/scripts/letter.ts`): own validation messages under the line (`aria-invalid`, linked with `aria-describedby`), focus on the first invalid field, sending with `fetch`, a polite live region while sending, a `role="alert"` region for the failure (with the email as an alternative), and focus on the thank-you panel after success. All text comes from `invite.ts`, rendered into the page.
- Email subject: "Πρόσκληση: {name}, {place}" (place = organization and/or city, left out if both are empty); without JavaScript a fixed subject. Field names in the email are the `key`s in `invite.ts` (Greek, readable).
- Spam: the Web3Forms honeypot `botcheck`, a checkbox hidden with `display: none` (not reachable by keyboard or screen readers).
- **Trying the states without a key (dev only):** run `npm run dev` and open `/proskaleste-mas/?simulate=success` or `/proskaleste-mas/?simulate=failure`, fill in name and email and press "Αποστολή": the sending state shows for 1.6 s, then success or failure. The check sits behind `import.meta.env.DEV`, so it is removed from production builds (verify: the built page contains no `simulate`). Without the parameter and without a key, dev shows the "form not configured" message. The thank-you panel without JavaScript can be seen at `/proskaleste-mas/#letter-sent`.

## News and events (/nea)

Posts and events will come from Sanity once all external connections are set up. Until then they are placeholder content in Astro content collections, with fields shaped like the planned Sanity schema so nothing is rewritten later.

### Content model

- **Post** (`src/content.config.ts`, collection `news`): `title`, `slug` (latin, written explicitly, never generated from the Greek title), `date`, `category` (`nea` = Νέα, `afigiseis` = Από τις αφηγήσεις μας, `typos` = Στον Τύπο), `excerpt`, optional `cover`, optional `gallery`, optional `venue` and `city` (event reports), optional `sample` (see below), and the body (rich text).
- **Image** (cover and gallery items): `image` (the file), `alt` (required) and optional `caption`. This matches a Sanity image with alt and caption fields. While `image` is left out, a placeholder is shown, using `alt` as its hint.
- **Event** (collection `events`): `title`, `date` (YYYY-MM-DD), optional `time` (HH:MM; "η ώρα θα ανακοινωθεί" is shown without it), `venue`, `city`, `audience` (one short line), optional `link`, optional `sample`.
- **Sample content:** the invented placeholder posts and events carry `sample: true`. Sample posts show the ΠΡΟΣΩΡΙΝΟ ΚΕΙΜΕΝΟ tag on their page. With `LAUNCHED = true` the build **stops** while any sample post or event is left, listing each by slug or id, so invented news can never go live. Real posts and events leave the field out. The check is in the SOURCE loaders of `src/lib/news.ts`. When the last post or event is deleted, Astro warns that the collection is empty; that warning is harmless, and the pages show their empty states.
- Slugs must be latin lowercase with hyphens, and `selida` and `kategoria` are reserved (they are listing URLs). The build stops with a clear message otherwise.
- Category labels, their URL segments, each category listing's meta description, the page size (`POSTS_PER_PAGE`) and all page copy live in `src/data/news.ts`. Every listing page has its own description: the category's, plus "Σελίδα N." from page 2 on.

### Adding a post by hand (until Sanity)

1. Create a folder named after the slug: `src/content/news/<slug>/`.
2. In it, create `index.md` with the frontmatter fields above (copy an existing post as a starting point) and the text below the frontmatter in Markdown (see "Writing the body" below).
3. Put the post's photos in the same folder and refer to them relatively:
   - cover or gallery item: `image: ./cover.jpg` with its `alt` (and `caption` if wanted);
   - a photo inside the text: `![alt text](./photo.jpg "caption")`.
4. Run `npm run build`; a missing field, a bad slug or a missing photo stops the build with the reason.

### Writing the body

- Paragraphs are separated by an empty line. The first paragraph gets the red drop cap automatically, when it starts with a letter (not with « or a number).
- `## Heading` is a subheading (italic, with a leaf). `### Heading` is a small one, shown in capitals.
- `- item` makes a list with red diamonds; `1. item` a numbered list with plain, quiet numbers.
- A photo on its own line, `![alt text](./photo.jpg "caption")`, becomes a framed figure with the caption under it. Leave out the quoted caption if there is none.
- `> text` is a quote, shown centred with a small flower. Do not type « » around it; they are added. For an attribution, end the quote with a line starting with an en dash (–):
  ```
  > Η αφήγηση δεν είναι ανάγνωση.
  >
  > – από το άρθρο της «Καθημερινής»
  ```
- Links: `[text](https://...)`, shown in red.
- A post with a single paragraph ends with a small flower, so it does not look unfinished.

These rules are applied by `src/lib/post-markdown.ts` (a Sätteri hast plugin registered in `astro.config.mjs`) and styled in `PostBody.astro`. Markdown output cannot contain components, so the leaf and the flowers in the body are CSS masks of `oak-leaf.svg` and `flower.svg` (a second exception to inline ornaments, after the tree).

Adding an event: add an entry to `src/content/events.json` with a unique `id` (latin, like a slug).

### Data layer

- `src/lib/news.ts` is the only code that reads the collections. Pages use its functions (`getPosts`, `getPostBySlug`, `getRelatedPosts`, `getUpcomingEvents`, `getListingPage`, `getListingPaths`, `groupByYear`, `dateParts`) and its types (`Post`, `NewsEvent`, `NewsImage`), which do not depend on the source.
- The post body is rendered in one place only: `src/components/news/PostBody.astro`, through `loadPostBody()`.
- "Upcoming" events are those dated today or later in Athens time, decided **at build time**. The site therefore needs a daily rebuild (see the pre-launch checklist); without it a past event would stay on the board until the next deploy.

### URLs

All listing pages are real static pages, so the filter and the pagination work without JavaScript and can be crawled:

```
/nea                                  all posts, page 1, with the intro and the events board
/nea/selida/2                         all posts, page 2 …
/nea/kategoria/nea                    Νέα
/nea/kategoria/apo-tis-afigiseis-mas  Από τις αφηγήσεις μας
/nea/kategoria/ston-typo              Στον Τύπο
/nea/kategoria/<category>/selida/2    …
/nea/<slug>                           a post
```

`src/pages/nea/index.astro` builds `/nea`; `src/pages/nea/[...listing].astro` builds every other listing page from `getListingPaths()`. The events board appears only on `/nea`. Page size: `POSTS_PER_PAGE` in `src/data/news.ts`.

### Post page

- `src/pages/nea/[slug].astro`: breadcrumb, the art nouveau title frame (category, title, date, venue and city when set), the cover, the body, the gallery, the share row, related posts and a quiet link back to `/nea`. No footer invitation.
- **Gallery** (`src/sections/news/PostGallery.astro`, only when the post has gallery photos): a horizontal strip with native scrolling and scroll-snap, one large photo and a peek of the next, caption under each. Its title is "Από τη βραδιά" on event reports and "Φωτογραφίες" otherwise (`labelByCategory` in `news.ts`).
  - Without JavaScript: the strip scrolls by touch, trackpad or arrow keys once focused, and each photo links to its large version (up to 1600px wide, made at build time).
  - With JavaScript (`src/scripts/post.ts`): the counter ("2 / 5", announced to screen readers as "Φωτογραφία 2 από 5"), previous/next buttons that turn off at the ends, arrow keys, Home and End on the focused strip. Clicking a photo opens it in a native `<dialog>`: Esc or a click outside closes it, arrow keys change the photo, and on closing the strip shows the last photo seen and focus returns to it. With reduced motion the strip jumps instead of scrolling smoothly.
  - Photo share of the strip: `--gallery-item` and `--gallery-item-mobile` in `tokens.css`.
- **Share row**: Facebook and email are plain links built from the page's canonical URL (so they use the real domain only once `siteUrl` is set). "Αντιγραφή συνδέσμου" appears only when the browser can copy (HTTPS or localhost), copies the address the visitor is on, and shows "Αντιγράφηκε" for `COPIED_TIME` (top of `post.ts`). No third-party scripts.
- **Related posts** (`src/sections/news/RelatedPosts.astro`): up to three, same category first, then the most recent (`getRelatedPosts`). Thumbnails only for posts with a cover.
- The frame is a fixed top and base with stems that stretch to the height of the title, so it holds any title length. Titles longer than `LONG_TITLE` characters (a constant at the top of the page) are set smaller.
- The "ΠΡΟΣΩΡΙΝΟ ΚΕΙΜΕΝΟ" tag shows on posts marked `sample: true` (and only while `SHOW_PLACEHOLDER_TAGS` is on).

### Switching to Sanity

1. Create the Sanity schema with the same fields as above (post, image with alt and caption, event).
2. In `src/lib/news.ts`, reimplement the functions marked SOURCE (`loadPosts`, `loadEvents`, `loadPostBody`) with Sanity queries that return the same `Post` and `NewsEvent` objects. Images become Sanity CDN URLs with `width` and `height` in `NewsImage`. `Photo.astro` already renders a remote URL (it needs `width` and `height`); add `cdn.sanity.io` to `image.domains` in `astro.config.mjs` so Astro optimizes those images.
3. In `PostBody.astro`, render Portable Text instead of the Markdown content, with the same markup `post-markdown.ts` produces today (drop cap spans, `figure`/`figcaption`, `figure.quote`), so the styles keep working. Then remove the plugin from `astro.config.mjs`.
4. Delete `src/content/news`, `src/content/events.json` and the collections in `src/content.config.ts`. Sanity holds no sample content, so the sample check (`refuseSamples` in `news.ts`) can go too.
5. Pages and the other components stay as they are.

## 404 page

- `src/pages/404.astro`, copy in `src/data/not-found.ts`. The host serves the built `404.html` for any address that does not exist.
- The drawing: the `yarn-ball` ornament with a short red thread unrolling from it to a cut, frayed end. The thread is drawn at build time with `drawThread()` (`src/lib/thread.ts`), so it matches the homepage thread and needs no JavaScript. Its path (waypoints), the ball's place and the frayed strands are named constants at the top of the page.
- On load the thread draws itself once with CSS, then its twist, fibres and cut end fade in (`--thread-draw-duration`, `--thread-draw-delay` in `tokens.css`). Skipped under reduced motion.
- Always `noindex` (`noindex` on `BaseLayout`), whatever `LAUNCHED` says, and left out of the sitemap.

## SEO and launch

- `site` in `astro.config.mjs` comes from `contact.siteUrl`. Canonical URLs, Open Graph URLs, the sitemap and robots.txt are all built from it.
- `BaseLayout.astro` outputs the title, description, canonical, Open Graph and Twitter card tags, favicons (`public/favicon.svg`, `public/apple-touch-icon.png`) and JSON-LD. Pages can pass their own share image (`image`), mark themselves as an article (`article`, which sets `og:type` to article with `article:published_time` and `article:section`) and add structured data (`structuredData`).
- `src/lib/seo.ts` holds the share image and the structured data, with values from `contact.ts`, `site.ts`, `images.ts` and the news data layer only:
  - `shareImage()`: a 1200x630 JPEG, made at build time from a post's cover, or the site image (`ogImage`) when there is no cover or it is a placeholder.
  - JSON-LD is one `@graph`: the group (`PerformingGroup`, on every page, with the id `/#group`), plus an `Article` on each post (title, excerpt, date, section, share image, the group as author and publisher) and an `Event` for each upcoming event on `/nea` (date and time with the Athens offset, or the day alone while the time is not announced; venue and city; the event's link or `/nea`).
- `@astrojs/sitemap` generates `sitemap-index.xml` with every page, including each post and every listing page. `src/pages/robots.txt.ts` generates `robots.txt`.

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
4. **Images:** replace every placeholder in `src/data/images.ts` (the milestone photos, the portraits and `ogImage`), with alt text written for the real images. If the group has its own logo, replace `public/favicon.svg` and `public/apple-touch-icon.png` (180×180) too.
5. **Copy:** replace the provisional milestone, testimonial and partner texts in `site.ts`; the texts marked `placeholder` in `team.ts`, `invite.ts` (including every FAQ answer, which must be confirmed with the group), `news.ts` (the `/nea` intro and the events board title) and `not-found.ts`; and add partner logos.
6. **Sample news:** delete every post and event marked `sample: true` (the 12 posts in `src/content/news` and the 4 events in `src/content/events.json`) and add the real ones, or switch to Sanity. The invented posts describe things that did not happen (an article in «Καθημερινή», an interview on ΕΡΤ, festival nights), so none may go live; the build refuses to run with `LAUNCHED = true` while any are left. The site works with no posts or events at all (empty states).
7. **Placeholder tags off:** set `SHOW_PLACEHOLDER_TAGS = false` in `site.ts`.
8. **LAUNCHED on:** set `LAUNCHED = true` in `site.ts`.
9. Run `npm run build` and `npm run lint`, then check `dist/robots.txt`, the page `<head>` and a share preview (for example with the Facebook Sharing Debugger) of the homepage and of a post with a cover. Check the structured data of a post and of `/nea` (with upcoming events) with Google's Rich Results Test (search.google.com/test/rich-results).
10. Test the red thread and the storytellers sequence on a real mid-range phone. On an Android phone, also check that text does not jump when the fonts load: the Noto Serif fallback values were computed from the font files but could not be tested on a device.
11. **Daily rebuild** (so past events leave the "upcoming" board): in the host's settings, create a deploy hook (a secret URL that starts a new build), then schedule a daily request to it shortly after midnight Athens time, for example with the host's scheduled functions, a GitHub Actions `schedule` workflow or a cron service. Check the next day that a build ran. Once Sanity is connected, also trigger the same hook from Sanity's webhook on publish.
12. **The old Blogspot blog:** its post URLs will stop existing once the posts move here. Before launch decide:
    1. whether the old blog address sends visitors to the new site. Blogger's own "custom redirects" only work between addresses inside the blog, so check the current options when deciding; common approaches are moving the blog's custom domain (if it has one) to the new host, a redirect in the Blogger theme, or a notice with a link on the old blog; and
    2. whether the most visited old posts that get migrated get redirects from their old paths to their new `/nea/<slug>` addresses (for example a `_redirects` file on the host, which works when the old blog's domain points to the new site). Check which old posts are visited most (Blogger stats or Search Console) and list old URL and new slug side by side.

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
4. Update `--font-display` and/or `--font-body` in `tokens.css` to the new family name (as written in the package's CSS `font-family`). Keep the fallback stack after it, for example `"New Font", "New Font Fallback", "New Font Fallback Noto", Georgia, "Times New Roman", serif`.
5. **Fallback metrics (no layout shift).** Until the web font arrives, text is set in a local font (Georgia; Noto Serif on Android) scaled to take the same space, so nothing moves when the web font swaps in. These are the `@font-face` blocks named `… Fallback` and `… Fallback Noto` at the top of `tokens.css`, one per style (normal, italic). Their `size-adjust`, `ascent-override` and `descent-override` values belong to the current fonts, so recompute them for a new font:
   - Rename the blocks to the new font (`"New Font Fallback"`, `"New Font Fallback Noto"`) and get starting values from a fallback font generator (for example screenspan.net/fallback): new font against Georgia, then against Noto Serif, for each style.
   - Check in the browser: on `/omada` at phone width, open the developer tools, select the page title and compare its height with `font-family: "New Font"` and with `font-family: "New Font Fallback"`. Adjust `size-adjust` until the two match (a line more or less is what causes the shift). Do the same for a body paragraph with the body font.
   - If this is too fiddly, deleting the fallback blocks and names is safe: the site still works, with a small jump of the text when the fonts load.
6. Uninstall the old package: `npm uninstall @fontsource/<old-font-name>`.
7. Run `npm run build` and check the homepage: Greek text with accents, polytonic characters, italics, and uppercase labels (no tonos, diaeresis kept, as in ΠΡΩΤΕΪΝΗ).
