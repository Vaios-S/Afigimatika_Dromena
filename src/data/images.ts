/**
 * Image registry. Components reference images by key only, never by path.
 *
 * HOW TO REPLACE A PLACEHOLDER WITH A REAL IMAGE
 * 1. Put the real file in src/assets/images/, named as the entry's `src`
 *    (for example src/assets/images/milestone-beginning.jpg).
 * 2. Change `placeholder: true` to `placeholder: false` for that entry.
 * That's it. To use a different file name, also change `src`.
 *
 * While `placeholder` is true, src/assets/placeholders/photo.svg is shown with
 * the alt text as a caption. Real images are optimized by Astro at build time
 * (resized, AVIF/WebP). Accepted formats: jpg, jpeg, png, webp, avif.
 * `alt` describes the photo for screen readers; write it for the real image.
 */

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
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;
