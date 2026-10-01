/**
 * Data layer for "Νέα & Εκδηλώσεις". The only module that knows where posts
 * and events come from (today: Astro content collections in src/content;
 * later: Sanity). Pages and components use the functions and types below and
 * never read the collections themselves.
 *
 * To switch to Sanity: reimplement the three loaders marked SOURCE below so
 * they return the same Post / NewsEvent objects, and replace the body
 * rendering in src/components/news/PostBody.astro. See CLAUDE.md.
 */
import type { ImageMetadata } from "astro";
import { getCollection, render, type CollectionEntry } from "astro:content";
import { categories, POSTS_PER_PAGE } from "../data/news";
import { LAUNCHED, routes } from "../data/site";

/* ==========================================================================
   Types (source-independent)
   ========================================================================== */

export type Category = keyof typeof categories;

/**
 * An image from the content. `src` is a local file today and a CDN URL
 * (with width and height) from Sanity later; null while it is a placeholder.
 */
export interface NewsImage {
  src: ImageMetadata | string | null;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface Post {
  slug: string;
  /** Page URL, /nea/<slug>. */
  url: string;
  title: string;
  /** Publication day, YYYY-MM-DD. */
  date: string;
  year: number;
  category: Category;
  excerpt: string;
  cover?: NewsImage;
  gallery: NewsImage[];
  venue?: string;
  city?: string;
  /** Invented placeholder content: shows the placeholder tag. */
  sample: boolean;
}

export interface NewsEvent {
  id: string;
  title: string;
  /** Day of the event, YYYY-MM-DD (Athens time). */
  date: string;
  /** HH:MM, or undefined while not announced. */
  time?: string;
  venue: string;
  city: string;
  audience: string;
  link?: string;
}

/* ==========================================================================
   SOURCE: content collections (the part to replace for Sanity)
   ========================================================================== */

type PostEntry = CollectionEntry<"news">;
type ImageData = NonNullable<PostEntry["data"]["cover"]>;

function toImage(data: ImageData): NewsImage {
  return {
    src: data.image ?? null,
    alt: data.alt,
    caption: data.caption,
    width: data.image?.width,
    height: data.image?.height,
  };
}

function toPost(entry: PostEntry): Post {
  const { data } = entry;
  const date = data.date.toISOString().slice(0, 10);
  return {
    slug: data.slug,
    url: `${routes.news}/${data.slug}`,
    title: data.title,
    date,
    year: Number(date.slice(0, 4)),
    category: data.category,
    excerpt: data.excerpt,
    cover: data.cover ? toImage(data.cover) : undefined,
    gallery: data.gallery.map(toImage),
    venue: data.venue,
    city: data.city,
    sample: data.sample,
  };
}

/**
 * Sample content must never go live: with LAUNCHED = true the build stops
 * here, naming every sample post or event that is still in src/content.
 */
function refuseSamples(kind: string, where: string, names: string[]) {
  if (!LAUNCHED || names.length === 0) return;
  throw new Error(
    [
      `LAUNCHED is true, but ${String(names.length)} sample ${kind} (sample: true) are still in ${where}:`,
      ...names.map((name) => `  ${name}`),
      "Delete or replace them before launch (pre-launch checklist in CLAUDE.md), or set LAUNCHED back to false in src/data/site.ts.",
    ].join("\n"),
  );
}

/** SOURCE: every post, newest first. */
async function loadPosts(): Promise<Post[]> {
  const entries = await getCollection("news");
  refuseSamples(
    "posts",
    "src/content/news",
    entries.filter((e) => e.data.sample).map((e) => e.data.slug),
  );
  return entries.map(toPost).sort((a, b) => b.date.localeCompare(a.date));
}

/** SOURCE: every event, in date order. */
async function loadEvents(): Promise<NewsEvent[]> {
  const entries = await getCollection("events");
  refuseSamples(
    "events",
    "src/content/events.json",
    entries.filter((e) => e.data.sample).map((e) => e.id),
  );
  return entries
    .map(({ id, data }) => ({ id, ...data }))
    .sort((a, b) =>
      (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")),
    );
}

/**
 * SOURCE: the renderable body of a post. PostBody.astro is the only caller.
 * With Sanity this returns the Portable Text blocks instead.
 */
export async function loadPostBody(post: Post) {
  const entries = await getCollection("news");
  const entry = entries.find((item) => item.data.slug === post.slug);
  if (!entry) throw new Error(`Post "${post.slug}" not found`);
  const { Content } = await render(entry);
  return Content;
}

/* ==========================================================================
   Queries used by the pages
   ========================================================================== */

export async function getPosts(category?: Category): Promise<Post[]> {
  const posts = await loadPosts();
  return category ? posts.filter((post) => post.category === category) : posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await loadPosts()).find((post) => post.slug === slug);
}

/** Up to `count` other posts: same category first, then the most recent. */
export async function getRelatedPosts(post: Post, count = 3): Promise<Post[]> {
  const others = (await loadPosts()).filter((item) => item.slug !== post.slug);
  const same = others.filter((item) => item.category === post.category);
  const rest = others.filter((item) => item.category !== post.category);
  return [...same, ...rest].slice(0, count);
}

/** Today in Athens, YYYY-MM-DD. */
export function athensToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(
    now,
  );
}

/**
 * Events from today on (Athens time). Decided at build time, so the site is
 * rebuilt daily (see the pre-launch checklist in CLAUDE.md).
 */
export async function getUpcomingEvents(
  today = athensToday(),
): Promise<NewsEvent[]> {
  return (await loadEvents()).filter((event) => event.date >= today);
}

/* ==========================================================================
   Listing pages: /nea, /nea/selida/<n>, /nea/kategoria/<path>[/selida/<n>]
   ========================================================================== */

export function listingUrl(category?: Category, page = 1): string {
  const base = category
    ? `${routes.news}/kategoria/${categories[category].path}`
    : routes.news;
  return page > 1 ? `${base}/selida/${page}` : base;
}

export interface ListingPage {
  category?: Category;
  page: number;
  pageCount: number;
  posts: Post[];
  /** Newer page (previous number), if any. */
  newerUrl?: string;
  /** Older page (next number), if any, with the years it covers. */
  older?: { url: string; firstYear: number; lastYear: number };
}

export async function getListingPage(
  category: Category | undefined,
  page: number,
): Promise<ListingPage> {
  const all = await getPosts(category);
  const pageCount = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const next = all.slice(start + POSTS_PER_PAGE, start + 2 * POSTS_PER_PAGE);
  return {
    category,
    page,
    pageCount,
    posts: all.slice(start, start + POSTS_PER_PAGE),
    newerUrl: page > 1 ? listingUrl(category, page - 1) : undefined,
    older: next.length
      ? {
          url: listingUrl(category, page + 1),
          firstYear: next[0].year,
          lastYear: all[all.length - 1].year,
        }
      : undefined,
  };
}

/** Every listing page to build: all posts and each category, page by page. */
export async function getListingPaths(): Promise<
  { category?: Category; page: number }[]
> {
  const paths: { category?: Category; page: number }[] = [];
  for (const category of [
    undefined,
    ...(Object.keys(categories) as Category[]),
  ]) {
    const count = Math.max(
      1,
      Math.ceil((await getPosts(category)).length / POSTS_PER_PAGE),
    );
    for (let page = 1; page <= count; page++) paths.push({ category, page });
  }
  return paths;
}

/** Posts grouped by year, newest year first (the chronicle). */
export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const groups: { year: number; posts: Post[] }[] = [];
  for (const post of posts) {
    const last = groups[groups.length - 1];
    if (last?.year === post.year) last.posts.push(post);
    else groups.push({ year: post.year, posts: [post] });
  }
  return groups;
}

/* ==========================================================================
   Dates in Greek
   ========================================================================== */

/** Parts of a YYYY-MM-DD day for display ("18", "Οκτωβρίου", "Σάββατο", "Οκτ"). */
export function dateParts(isoDay: string) {
  const date = new Date(`${isoDay}T12:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("el-GR", {
      timeZone: "UTC",
      ...options,
    }).formatToParts(date);
  const part = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: String(date.getUTCDate()),
    /** Genitive month, as in "18 Οκτωβρίου". */
    month: part(format({ day: "numeric", month: "long" }), "month"),
    monthShort: part(
      format({ day: "numeric", month: "short" }),
      "month",
    ).replace(".", ""),
    weekday: part(format({ weekday: "long" }), "weekday"),
    year: date.getUTCFullYear(),
    /** Full date for screen readers and <time> text, "18 Οκτωβρίου 2026". */
    long: new Intl.DateTimeFormat("el-GR", {
      timeZone: "UTC",
      dateStyle: "long",
    }).format(date),
  };
}
