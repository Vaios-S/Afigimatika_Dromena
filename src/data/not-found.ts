/**
 * Copy for the 404 page (src/pages/404.astro).
 * Labels shown in capitals are stored in normal case.
 * Never use em dashes in copy (ESLint enforces this).
 */
import { routes } from "./site";

export const notFound = {
  /** Browser tab title; the site name is appended. */
  title: "Η σελίδα δεν βρέθηκε",
  description: "Η σελίδα που ψάχνετε δεν υπάρχει.",
  placeholder: true,
  label: "Σφάλμα 404",
  heading: "Εδώ η κλωστή κόπηκε",
  text: "Η σελίδα που ψάχνετε δεν υπάρχει ή πήγε να ζήσει σε άλλο παραμύθι.",
  home: { label: "Στην αρχική", href: routes.home },
  links: [
    { label: "Νέα & Εκδηλώσεις", href: routes.news },
    { label: "Προσκαλέστε μας", href: routes.invite },
  ],
};
