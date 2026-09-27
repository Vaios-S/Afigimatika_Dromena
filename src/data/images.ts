/**
 * Image registry. Components reference images by key only, never by path.
 *
 * HOW TO REPLACE A PLACEHOLDER WITH A REAL IMAGE
 * 1. Put the real file in src/assets/images/, named as the entry's `src`
 *    (for example src/assets/images/milestone-beginning.jpg).
 * 2. Change `placeholder: true` to `placeholder: false` for that entry.
 * That's it. To use a different file name, also change `src`.
 *
 * While `placeholder` is true, a placeholder is shown instead: for photos,
 * src/assets/placeholders/photo.svg with the alt text as a caption; for the
 * share image, src/assets/placeholders/og-image.png.
 * Real images are optimized by Astro at build time (resized, AVIF/WebP).
 * Accepted formats: jpg, jpeg, png, webp, avif.
 * `alt` describes the image for screen readers; write it for the real image.
 */
import type { ImageMetadata } from "astro";

export interface ImageEntry {
  /** File name inside src/assets/images/. */
  src: string;
  alt: string;
  placeholder: boolean;
}

export const images = {
  milestoneBeginning: {
    src: "milestone-beginning.jpg",
    alt: "Οι τρεις αφηγήτριες",
    placeholder: true,
  },
  milestoneFirstPerformance: {
    src: "milestone-first-performance.jpg",
    alt: "Η πρώτη αφήγηση",
    placeholder: true,
  },
  milestoneMinistry: {
    src: "milestone-ministry.jpg",
    alt: "Πρόγραμμα αφήγησης σε σχολείο",
    placeholder: true,
  },
  milestonePelion: {
    src: "milestone-pelion.jpg",
    alt: "Αφήγηση σε πλατεία στο Πήλιο",
    placeholder: true,
  },
  /** Storyteller portraits (/omada), shown in an arched frame; portrait orientation, about 4:5. */
  portraitStivachtari: {
    src: "portrait-stivachtari.jpg",
    alt: "Η Στέλλα Στιβαχτάρη",
    placeholder: true,
  },
  portraitTsatsaroni: {
    src: "portrait-tsatsaroni.jpg",
    alt: "Η Στέλλα Τσατσαρώνη",
    placeholder: true,
  },
  portraitBasdara: {
    src: "portrait-basdara.jpg",
    alt: "Η Ελένη Μπασδάρα",
    placeholder: true,
  },
  /** Preview image when a page is shared (Open Graph). Best at 1200x630; other sizes are cropped to fit. */
  ogImage: {
    src: "og-image.jpg",
    alt: "Αφηγηματικά Δρώμενα: παραμύθια, μύθοι και θρύλοι απ’ όλο τον κόσμο",
    placeholder: true,
  },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;

/* --------------------------------------------------------------------------
   Lookup used by components. Nothing to edit below this line.
   -------------------------------------------------------------------------- */

const files = import.meta.glob<ImageMetadata>(
  "../assets/images/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

/**
 * The real image file for an entry, or undefined while it is a placeholder.
 * Fails the build with a clear message if a non-placeholder file is missing.
 */
export function imageFile(key: ImageKey): ImageMetadata | undefined {
  const entry: ImageEntry = images[key];
  if (entry.placeholder) return undefined;
  const file = files[`../assets/images/${entry.src}`];
  if (!file) {
    throw new Error(
      `Image "${key}": src/assets/images/${entry.src} not found. Add the file or set placeholder: true.`,
    );
  }
  return file;
}
