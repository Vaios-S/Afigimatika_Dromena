# Αφηγηματικά Δρώμενα

The website for Αφηγηματικά Δρώμενα, a group of three storytellers from Thessaloniki who perform folk tales, myths and legends for children and adults.

Built with [Astro](https://astro.build), TypeScript (strict) and plain CSS with design tokens. The output is a static site. The site is in Greek; an English version comes later.

**Status:** in development, pre-launch. Content, images and contact details are still placeholders, and search engine indexing is off. See the [pre-launch checklist](CLAUDE.md#pre-launch-checklist).

Detailed conventions and how-tos live in [CLAUDE.md](CLAUDE.md).

## Getting started

Requires Node.js 22.12 or later (see `engines` in `package.json`).

```sh
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # type check (astro check) and static build to dist/
npm run preview   # serve the built dist/ locally
npm run lint      # ESLint and Prettier check
npm run format    # Prettier write
```

Run `npm run build` and `npm run lint` before every commit; both must pass.

### Testing on a phone

1. Connect the phone to the same Wi-Fi network as the computer.
2. Start the dev server so it listens on the network: `npm run dev -- --host`.
3. Open the **Network** address it prints (for example `http://192.168.1.20:4321`) on the phone.

On Windows, allow Node.js through the firewall on private networks when asked. To test the production build instead, run `npm run build`, then `npm run preview -- --host`.

## Pages

| Route                  | Page                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| `/`                    | Homepage, with the scroll-drawn red thread                           |
| `/omada`               | The group: the three storytellers                                    |
| `/nea`                 | News and events: upcoming events board and the chronicle of posts    |
| `/nea/selida/<n>`      | Older pages of the chronicle                                         |
| `/nea/kategoria/<cat>` | The chronicle filtered by category (with its own pages)              |
| `/nea/<slug>`          | A post                                                               |
| `/proskaleste-mas`     | Invite us: the letter form and the FAQ                               |
| `404`                  | Not found: served by the host for any missing address, never indexed |

## Project structure

```
design/                 approved designs (export bundles; references/ is gitignored)
public/                 favicons, copied as is
src/
  assets/
    images/             real photos (see "Images" in CLAUDE.md)
    ornaments/          one single-colour SVG per ornament
    placeholders/       placeholder photo and share image
    tree/               the tree drawings on /proskaleste-mas (CSS masks)
  components/           shared pieces: Header, Footer, Photo, Ornament, Button, …
    news/PostBody.astro the only place post bodies are rendered
  content/
    news/<slug>/        one folder per post: index.md and its photos
    events.json         upcoming events
  data/                 all copy and settings, one file per page
    site.ts             homepage and shared copy, routes, flags
    team.ts             /omada
    invite.ts           /proskaleste-mas
    news.ts             /nea and the post pages
    not-found.ts        the 404 page
    contact.ts          every contact detail and the site URL
    images.ts           the image registry
  layouts/              BaseLayout (head, SEO tags, header, footer)
  lib/                  news data layer, Markdown plugin for posts, SEO, thread drawing
  pages/                one file per route (see "Pages" above)
  scripts/              the four client scripts (red thread, storytellers, invite form, post page)
  sections/             page sections, grouped by page (home, team, invite, news)
  styles/               tokens.css (colours, fonts, spacing) and global.css
```

## Where to change things

| To change                    | See in CLAUDE.md                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Page copy                    | [Content](CLAUDE.md#content)                                                                                          |
| Contact details and site URL | [Contact info](CLAUDE.md#contact-info)                                                                                |
| Photos                       | [Images](CLAUDE.md#images)                                                                                            |
| Ornaments                    | [How to replace an ornament](CLAUDE.md#how-to-replace-an-ornament-with-your-own-drawing)                              |
| Fonts                        | [How to change fonts](CLAUDE.md#how-to-change-fonts)                                                                  |
| News posts and events        | [Adding a post by hand](CLAUDE.md#adding-a-post-by-hand-until-sanity), [Writing the body](CLAUDE.md#writing-the-body) |
| Placeholder tags, indexing   | [Content](CLAUDE.md#content), [The LAUNCHED flag](CLAUDE.md#the-launched-flag)                                        |

## Environment variables

Copy [`.env.example`](.env.example) to `.env` and fill in the values; each variable is explained there. `.env` is gitignored. The site builds without any of them. The same variables must be set in the host's build settings before launch (see the [pre-launch checklist](CLAUDE.md#pre-launch-checklist)).
