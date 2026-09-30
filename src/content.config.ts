/**
 * Content collections for "Νέα & Εκδηλώσεις" (/nea).
 *
 * The fields mirror the planned Sanity schema, so switching to Sanity later
 * only changes src/lib/news.ts (where the content comes from) and
 * src/components/news/PostBody.astro (how the body is rendered).
 * Nothing else reads these collections.
 *
 * Posts:  src/content/news/<slug>/index.md, with the post's images beside it.
 * Events: src/content/events.json.
 */
import { defineCollection, type SchemaContext } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { categories } from "./data/news";

/** Slugs used by the listing's own URLs (/nea/selida/2, /nea/kategoria/...). */
export const RESERVED_SLUGS = ["selida", "kategoria"];

/** Post categories (stored values); labels and URL segments are in src/data/news.ts. */
const CATEGORIES = Object.keys(categories) as [
  keyof typeof categories,
  ...(keyof typeof categories)[],
];

const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Latin lowercase letters, digits and hyphens only",
  )
  .refine((value) => !RESERVED_SLUGS.includes(value), {
    message: `Reserved for the listing's URLs: ${RESERVED_SLUGS.join(", ")}`,
  });

/**
 * An image with its alt text and an optional caption (Sanity: an image with
 * alt and caption fields). `image` is a file beside the post (./cover.jpg);
 * while it is missing, a placeholder is shown with `alt` as its hint.
 */
const picture = ({ image }: SchemaContext) =>
  z.object({
    image: image().optional(),
    alt: z.string().min(1),
    caption: z.string().optional(),
  });

const news = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/news" }),
  schema: (context) =>
    z.object({
      title: z.string().min(1),
      slug,
      date: z.coerce.date(),
      category: z.enum(CATEGORIES),
      excerpt: z.string().min(1),
      cover: picture(context).optional(),
      gallery: z.array(picture(context)).default([]),
      /** Event reports: where the storytelling took place. */
      venue: z.string().optional(),
      city: z.string().optional(),
    }),
});

const events = defineCollection({
  loader: file("./src/content/events.json"),
  schema: z.object({
    title: z.string().min(1),
    /** Day of the event, YYYY-MM-DD (Athens time). */
    date: z.iso.date(),
    /** HH:MM; leave out while the time is not known. */
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    venue: z.string().min(1),
    city: z.string().min(1),
    /** Who it is for, one short line ("για όλη την οικογένεια"). */
    audience: z.string().min(1),
    link: z.url().optional(),
  }),
});

export const collections = { news, events };
