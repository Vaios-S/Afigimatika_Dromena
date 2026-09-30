/**
 * Copy for "Νέα & Εκδηλώσεις" (/nea) and the post pages (/nea/<slug>).
 * Posts and events themselves are content (src/content), read only through
 * src/lib/news.ts. Labels shown in capitals are stored in normal case.
 * Never use em dashes in copy (ESLint enforces this).
 */
import { routes } from "./site";

/** Posts per listing page (/nea, /nea/selida/2, category pages). */
export const POSTS_PER_PAGE = 10;

/**
 * Categories: the stored value (as in the content), the label and the latin
 * URL segment of its listing (/nea/kategoria/<path>).
 */
export const categories = {
  nea: { label: "Νέα", path: "nea" },
  afigiseis: { label: "Από τις αφηγήσεις μας", path: "apo-tis-afigiseis-mas" },
  typos: { label: "Στον Τύπο", path: "ston-typo" },
} as const;

export const news = {
  meta: {
    title: "Νέα & Εκδηλώσεις",
    description:
      "Οι επόμενες αφηγήσεις των Αφηγηματικών Δρώμενων και το χρονικό όσων έχουμε ζήσει ως τώρα: νέα, αφηγήσεις και δημοσιεύματα.",
    /** Title of a category listing; {category} is filled in. */
    categoryTitle: "{category} · Νέα & Εκδηλώσεις",
    /** Added to the title from page 2 on; {page} is filled in. */
    pageTitle: "σελίδα {page}",
  },

  intro: {
    label: "Νέα & Εκδηλώσεις",
    title: { text: "Ό,τι ειπώθηκε", accent: "και ό,τι έρχεται" },
    text: "Οι επόμενες αφηγήσεις μας και το χρονικό όσων έχουμε ζήσει ως τώρα, από τις αυλές των σχολείων ως τις πλατείες του Πηλίου.",
    placeholder: true,
  },

  events: {
    label: "Επόμενες αφηγήσεις",
    title: "Στον πίνακα ανακοινώσεων",
    placeholder: true,
    /** Shown when an event has no time yet. */
    timeTbd: "η ώρα θα ανακοινωθεί",
    /** Before the time: "στις 11:00". */
    timePrefix: "στις",
    details: "Λεπτομέρειες",
    empty: {
      text: "Δεν έχουμε κάτι προγραμματισμένο αυτές τις μέρες. Θέλετε να είστε εσείς η επόμενη;",
      action: { label: "Προσκαλέστε μας", href: routes.invite },
    },
  },

  chronicle: {
    label: "Το χρονικό μας",
    title: "Ό,τι γράψαμε στο τετράδιο",
    filterLabel: "Φίλτρο κατηγορίας",
    pagesLabel: "Σελίδες του χρονικού",
    all: "Όλα",
    /** Card to the next (older) page. */
    older: { kicker: "Γυρίστε τη σελίδα", label: "Παλαιότερα" },
    /** Link back to the previous (newer) page. */
    newer: "Νεότερα",
    /** "2024 και πριν", when the next page reaches further back. */
    andBefore: "και πριν",
    empty: "Δεν υπάρχουν ακόμα δημοσιεύσεις σε αυτή την κατηγορία.",
  },

  /** A post page (/nea/<slug>). */
  post: {
    /** The sample posts in src/content/news are placeholders. */
    placeholder: true,
    breadcrumbLabel: "Διαδρομή",
    back: "Πίσω στο χρονικό",
  },
};
