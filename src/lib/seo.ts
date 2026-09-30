/**
 * Search and sharing: the share image and the structured data (JSON-LD).
 * Values come from contact.ts, site.ts, images.ts and the news data layer
 * only. BaseLayout outputs them; pages pass their own image and data.
 */
import { getImage } from "astro:assets";
import ogPlaceholder from "../assets/placeholders/og-image.png";
import { contact } from "../data/contact";
import { imageFile, images } from "../data/images";
import { categories } from "../data/news";
import { routes, site } from "../data/site";
import type { NewsEvent, NewsImage, Post } from "./news";

/** Share images are 1200x630 JPEGs (Open Graph, Twitter, structured data). */
export const SHARE_SIZE = { width: 1200, height: 630 };

export interface ShareImage {
  /** Absolute URL. */
  url: string;
  alt: string;
}

/**
 * The share image: a post's cover cropped to 1200x630, or the site image
 * (`ogImage` in images.ts) when there is no cover or it is a placeholder.
 */
export async function shareImage(
  base: URL | undefined,
  cover?: NewsImage,
): Promise<ShareImage> {
  const own = cover?.src ? cover : undefined;
  const result = await getImage({
    src: own?.src ?? imageFile("ogImage") ?? ogPlaceholder,
    ...SHARE_SIZE,
    fit: "cover",
    format: "jpg",
  });
  return {
    url: new URL(result.src, base).href,
    alt: own?.alt ?? images.ogImage.alt,
  };
}

/* ==========================================================================
   Structured data (schema.org)
   ========================================================================== */

type Data = Record<string, unknown>;

const groupId = (base: URL | undefined) => new URL("/#group", base).href;

/** Reference to the group, for author, publisher, organizer and performer. */
const groupRef = (base: URL | undefined) => ({
  "@type": "PerformingGroup",
  "@id": groupId(base),
  name: site.name,
});

/** The group itself: on every page. */
export function groupData(base: URL | undefined, image: string): Data {
  return {
    "@type": "PerformingGroup",
    "@id": groupId(base),
    name: site.name,
    description: site.description,
    url: new URL("/", base).href,
    image,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: contact.city,
      addressCountry: contact.country,
    },
    sameAs: contact.social.map((link) => link.href),
  };
}

/** A post (/nea/<slug>). */
export function articleData(
  base: URL | undefined,
  post: Post,
  url: string,
  image: string,
): Data {
  return {
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: [image],
    inLanguage: "el",
    articleSection: categories[post.category].label,
    mainEntityOfPage: url,
    author: groupRef(base),
    publisher: groupRef(base),
  };
}

/**
 * Day and time in Athens as an ISO date-time with its offset
 * ("2026-10-18T11:00+03:00"), or the day alone while the time is not known.
 */
function athensDateTime(day: string, time?: string): string {
  if (!time) return day;
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Athens",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(`${day}T${time}:00Z`))
    .find((part) => part.type === "timeZoneName")
    ?.value.replace("GMT", "");
  return `${day}T${time}${offset ?? ""}`;
}

/** An upcoming event (on /nea). */
export function eventData(
  base: URL | undefined,
  event: NewsEvent,
  image: string,
): Data {
  return {
    "@type": "Event",
    name: event.title,
    startDate: athensDateTime(event.date, event.time),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: contact.country,
      },
    },
    description: event.audience,
    image: [image],
    url: event.link ?? new URL(`${routes.news}/`, base).href,
    organizer: groupRef(base),
    performer: groupRef(base),
  };
}
