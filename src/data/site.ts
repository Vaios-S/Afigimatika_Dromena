/**
 * All site copy. Components read text from here; none is hardcoded.
 * Labels shown in capitals are stored in normal case and uppercased by CSS.
 * Never use em dashes in copy (ESLint enforces this).
 */
import { contact } from "./contact";
import type { ImageKey } from "./images";

/**
 * Launch switch for search engines. While false, every page carries
 * <meta name="robots" content="noindex, nofollow"> and robots.txt disallows
 * everything, so preview deployments with placeholder content stay out of
 * search results. Set to true at launch (see the checklist in CLAUDE.md).
 */
export const LAUNCHED = false;

/** Show the "Προσωρινό κείμενο" tags on placeholder content. One switch for the whole site. */
export const SHOW_PLACEHOLDER_TAGS = true;

export const routes = {
  home: "/",
  team: "/omada",
  news: "/nea",
  invite: "/proskaleste-mas",
} as const;

export const site = {
  name: "Αφηγηματικά Δρώμενα",
  /** Open Graph locale of the Greek site. */
  locale: "el_GR",
  description:
    "Τρεις αφηγήτριες από τη Θεσσαλονίκη φέρνουν παραμύθια, μύθους και θρύλους απ’ όλο τον κόσμο σε σχολεία, βιβλιοθήκες, φεστιβάλ και πολιτιστικούς χώρους.",
  placeholderTag: "Προσωρινό κείμενο",
  photoPlaceholder: "Φωτογραφία",
  skipLink: "Μετάβαση στο περιεχόμενο",
};

export const invite = { label: "Προσκαλέστε μας", href: routes.invite };

const pages = {
  team: { label: "Η ομάδα", href: routes.team },
  news: { label: "Νέα & Εκδηλώσεις", href: routes.news },
  contact: { label: "Επικοινωνία", href: routes.invite },
};

export const hero = {
  kicker: `Αφήγηση παραμυθιών · ${contact.city}`,
  /** One entry per line; `accent` lines are set in red italic. */
  title: [
    { text: "Παραμύθια, μύθοι" },
    { text: "και θρύλοι", accent: true },
    { text: "απ’ όλο τον κόσμο." },
  ],
  lead: "Τρεις αφηγήτριες φέρνουν τα παραμύθια του κόσμου σε σχολεία, βιβλιοθήκες, φεστιβάλ και κάθε χώρο που θέλει να τα ακούσει.",
  secondaryAction: { label: "Γνωρίστε την ομάδα", href: routes.team },
};

interface Milestone {
  /** Shown as the small label above the title. */
  year: string;
  title: string;
  text: string;
  /** Key in src/data/images.ts. */
  image?: ImageKey;
  /** Content is provisional: shows the placeholder tag. */
  placeholder?: boolean;
}

export const redThread = {
  title: "Έτσι αρχίζουν τα παραμύθια",
  /** The traditional opening rhyme, one entry per line. */
  verse: [
    "Κόκκινη κλωστή δεμένη,",
    "στην ανέμη τυλιγμένη,",
    "δώσ’ της κλότσο να γυρίσει,",
    "παραμύθι ν’ αρχινήσει.",
  ],
  verseNote: "Κι έτσι ξετυλίγεται και η δική μας ιστορία, κόμπο κόμπο.",
  milestones: [
    {
      year: "20ΧΧ",
      title: "Η αρχή",
      text: "Τρεις φίλες γνωρίζονται μέσα από την κοινή τους αγάπη για τις ιστορίες και αρχίζουν να τις λένε μαζί.",
      image: "milestoneBeginning",
      placeholder: true,
    },
    {
      year: "20ΧΧ",
      title: "Η πρώτη αφήγηση",
      text: "Η πρώτη δημόσια αφήγηση, μπροστά σε ένα μικρό κοινό που στο τέλος ζήτησε κι άλλο παραμύθι.",
      image: "milestoneFirstPerformance",
      placeholder: true,
    },
    {
      year: "20ΧΧ",
      title: "Λέσχη Αφήγησης Θεσσαλονίκης",
      text: "Μαζί με τη Λέσχη, η προφορική αφήγηση γίνεται τέχνη που μελετάμε και μοιραζόμαστε.",
      placeholder: true,
    },
    {
      year: "20ΧΧ",
      title: "Συνεργασία με το Υπουργείο Πολιτισμού",
      text: "Εκπαιδευτικά προγράμματα αφήγησης για σχολεία και βιβλιοθήκες σε όλη τη χώρα.",
      image: "milestoneMinistry",
      placeholder: true,
    },
    {
      year: "20ΧΧ",
      title: "European Fairy Tale Route",
      text: "Τα παραμύθια μας ταξιδεύουν στον ευρωπαϊκό δρόμο των παραμυθιών.",
      placeholder: true,
    },
    {
      year: "20ΧΧ",
      title: "Φεστιβάλ Πηλίου",
      text: "Αφηγήσεις κάτω από τα πλατάνια του Πηλίου, για μικρούς και μεγάλους.",
      image: "milestonePelion",
      placeholder: true,
    },
    {
      year: "Σήμερα",
      title: "Σήμερα",
      text: "Αφηγήσεις σε όλη την Ελλάδα και στο εξωτερικό, σε κάθε χώρο που θέλει να ακούσει.",
      placeholder: true,
    },
  ] satisfies Milestone[],
  ending: { text: "…και το παραμύθι", accent: "συνεχίζεται." },
};

interface Audience {
  name: string;
  /** File name in src/assets/ornaments, without ".svg". */
  icon: string;
  /** Only the featured (first) tile shows a note. */
  note?: string;
}

export const about = {
  kicker: "Η ομάδα",
  title: { text: "Τρεις αφηγήτριες,", accent: "ένα κόκκινο νήμα" },
  text: "Είμαστε τρεις αφηγήτριες από τη Θεσσαλονίκη. Ερευνούμε λαϊκά παραμύθια, μύθους και θρύλους από κάθε γωνιά του κόσμου και τα λέμε ζωντανά, με τη φωνή και χωρίς βιβλίο στο χέρι, όπως λέγονταν πάντα.",
  link: { label: "Γνωρίστε την ομάδα", href: routes.team },
  audiencesTitle: "Πού και για ποιους αφηγούμαστε",
  /** The first entry is the featured tile. */
  audiences: [
    {
      name: "Παιδιά",
      icon: "audience-children",
      note: "Το πρώτο και πιο αγαπημένο μας κοινό.",
    },
    { name: "Σχολεία", icon: "audience-schools" },
    { name: "Βιβλιοθήκες", icon: "audience-libraries" },
    { name: "Φεστιβάλ", icon: "audience-festivals" },
    { name: "Καφέ & πολιτιστικοί χώροι", icon: "audience-cafes" },
    { name: "Δήμοι", icon: "audience-municipalities" },
    { name: "Ενήλικες", icon: "audience-adults" },
  ] satisfies Audience[],
};

export const testimonials = {
  title: "Τι λένε οι διοργανωτές",
  /** Quotes are provisional: shows the placeholder tag. */
  placeholder: true,
  featured: {
    quote:
      "Τα παιδιά έμειναν ακίνητα για μία ώρα και μετά ζητούσαν κι άλλο παραμύθι. Τέτοια ησυχία στο παιδικό τμήμα δεν είχαμε ξαναδεί.",
    source: "Υπεύθυνη παιδικού τμήματος, Δημοτική Βιβλιοθήκη",
  },
  more: [
    {
      quote: "Η αφήγηση άνοιξε κουβέντες στην τάξη που κράτησαν εβδομάδες.",
      source: "Εκπαιδευτικός, Δημοτικό Σχολείο",
    },
    {
      quote:
        "Γέμισαν την πλατεία με μικρούς και μεγάλους. Θα τις ξανακαλέσουμε σίγουρα.",
      source: "Οργανωτική επιτροπή, Φεστιβάλ",
    },
  ],
};

export const partners = {
  title: "Συνεργασίες",
  /** Shown under each name while logos are missing (with the placeholder tags). */
  logoPlaceholder: "λογότυπο",
  list: [
    "Υπουργείο Πολιτισμού",
    "European Fairy Tale Route",
    "Φεστιβάλ Πηλίου",
    "Λέσχη Αφήγησης Θεσσαλονίκης",
    "Δημοτική Βιβλιοθήκη Θεσσαλονίκης",
    "Δήμος Θεσσαλονίκης",
  ],
};

export const header = {
  navLabel: "Κύρια πλοήγηση",
  // No "Επικοινωνία" here: the invite button already links to that page.
  nav: [pages.team, pages.news],
  menuOpen: "Μενού",
  menuClose: "Κλείσιμο",
};

export const footer = {
  cta: {
    heading: {
      text: "Να φέρουμε ένα παραμύθι και",
      accent: "στον δικό σας χώρο;",
    },
  },
  tagline: "Αφηγήσεις σε όλη την Ελλάδα και το εξωτερικό",
  siteNav: {
    title: "Ο ιστότοπος",
    links: [pages.team, pages.news, pages.contact],
  },
  contactTitle: "Επικοινωνία",
  socialTitle: "Ακολουθήστε μας",
  languages: "Ελληνικά · English (σύντομα)",
};
