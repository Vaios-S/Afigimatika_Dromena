/**
 * All site copy. Components read text from here; none is hardcoded.
 * Labels shown in capitals are stored in normal case and uppercased by CSS.
 * Never use em dashes in copy (ESLint enforces this).
 */

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
  description:
    "Τρεις αφηγήτριες από τη Θεσσαλονίκη φέρνουν παραμύθια, μύθους και θρύλους απ’ όλο τον κόσμο σε σχολεία, βιβλιοθήκες, φεστιβάλ και πολιτιστικούς χώρους.",
  placeholderTag: "Προσωρινό κείμενο",
  skipLink: "Μετάβαση στο περιεχόμενο",
};

export const invite = { label: "Προσκαλέστε μας", href: routes.invite };

export const header = {
  navLabel: "Κύρια πλοήγηση",
  nav: [
    { label: "Η ομάδα", href: routes.team },
    { label: "Νέα & Εκδηλώσεις", href: routes.news },
    { label: "Επικοινωνία", href: routes.invite },
  ],
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
    links: header.nav,
  },
  contactTitle: "Επικοινωνία",
  socialTitle: "Ακολουθήστε μας",
  languages: "Ελληνικά · English (σύντομα)",
};
