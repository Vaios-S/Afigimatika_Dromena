/**
 * Copy for the "Η ομάδα" page (/omada). Components read text from here;
 * none is hardcoded. Shared copy (header, footer, routes) stays in site.ts.
 * Labels shown in capitals are stored in normal case and uppercased by CSS.
 * Never use em dashes in copy (ESLint enforces this).
 */
import type { ImageKey } from "./images";

interface Storyteller {
  name: string;
  /**
   * At most 220 characters, spaces included. Longer bios no longer fit the
   * pinned frame on a typical phone (375x667, iPhone Safari 390x664) or a
   * short laptop screen (1366x650), and those screens then get the stacked
   * list instead of the sequence. Measured limits: 226 to 247 characters.
   */
  bio: string;
  /** Favourite tales: three, each up to about 35 characters (one line on a phone). */
  tales: string[];
  /** Key in src/data/images.ts. */
  portrait: ImageKey;
  /** Corner drawing: a file in src/assets/ornaments, without ".svg". */
  ornament: "castle" | "dragon" | "tree";
  /** Content is provisional: shows the placeholder tag. */
  placeholder?: boolean;
}

interface Collaboration {
  name: string;
  text: string;
  placeholder?: boolean;
}

export const team = {
  meta: {
    title: "Η ομάδα",
    description:
      "Οι τρεις αφηγήτριες των Αφηγηματικών Δρώμενων, τα αγαπημένα τους παραμύθια, οι συνεργασίες και τα προγράμματά μας.",
  },

  intro: {
    label: "Η ομάδα",
    title: { text: "Τρεις αφηγήτριες", accent: "από τη Θεσσαλονίκη" },
    text: "Ερευνούμε και αφηγούμαστε λαϊκά παραμύθια, μύθους και θρύλους από όλο τον κόσμο. Τα λέμε ζωντανά, με τη φωνή και χωρίς βιβλίο στο χέρι, για παιδιά και για μεγάλους.",
    placeholder: true,
  },

  storytellers: {
    title: "Οι αφηγήτριες",
    /** "{n}" and "{total}" are replaced with the storyteller's position. */
    counter: "Αφηγήτρια {n} από {total}",
    talesTitle: "Αγαπημένα παραμύθια",
    /** Accessible name of the step buttons under the pinned frame. */
    navLabel: "Οι τρεις αφηγήτριες",
    list: [
      {
        name: "Στέλλα Στιβαχτάρη",
        bio: "Ερευνά τα λαϊκά παραμύθια της Ελλάδας και των Βαλκανίων και τα αφηγείται σε σχολεία και βιβλιοθήκες. Αγαπά τις ιστορίες με έξυπνες ηρωίδες και απρόσμενα τέλη. Συντονίζει τα εκπαιδευτικά προγράμματα της ομάδας.",
        tales: [
          "Η Κοντορεβυθούλα",
          "Ο βασιλιάς και ο κλέφτης",
          "Παραμύθια από τα Βαλκάνια",
        ],
        portrait: "portraitStivachtari",
        ornament: "castle",
        placeholder: true,
      },
      {
        name: "Στέλλα Τσατσαρώνη",
        bio: "Μεγάλωσε με τις ιστορίες της γιαγιάς της και σήμερα αναζητά μύθους και θρύλους από όλο τον κόσμο. Της αρέσει να αφηγείται για ενήλικες, σε καφέ και φεστιβάλ, αργά το βράδυ, όταν η αίθουσα σωπαίνει.",
        tales: ["Έρως και Ψυχή", "Μύθοι του Βορρά", "Θρύλοι της Θεσσαλονίκης"],
        portrait: "portraitTsatsaroni",
        ornament: "dragon",
        placeholder: true,
      },
      {
        name: "Ελένη Μπασδάρα",
        bio: "Αφηγείται κυρίως για μικρά παιδιά, με τραγούδι, ρυθμό και σιωπές ανάμεσα. Ερευνά παραμύθια από την Αφρική και τη Λατινική Αμερική και τα φέρνει στα ελληνικά με σεβασμό στην πηγή τους.",
        tales: [
          "Ο Ανάνσι και το κουτί με τις ιστορίες",
          "Ο λαγός και το φεγγάρι",
          "Τα τρία ρόδια",
        ],
        portrait: "portraitBasdara",
        ornament: "tree",
        placeholder: true,
      },
    ] satisfies Storyteller[],
  },

  collaborations: {
    label: "Ευρετήριο",
    title: { text: "Συνεργασίες", accent: "και προγράμματα" },
    placeholder: true,
    groups: [
      {
        numeral: "I",
        title: "Προγράμματα με το Υπουργείο Πολιτισμού",
        items: [
          {
            name: "Παραμύθια από τη Μάνα Γη",
            text: "Ιστορίες για τη φύση και τη σχέση μας με τη γη, για σχολεία και βιβλιοθήκες.",
          },
          {
            name: "ΝΑ ΜΙΛΗΣΩ; Παιχνίδια για τη ζωή και τον κόσμο",
            text: "Αφήγηση και παιχνίδι, για να βρουν τα παιδιά τη δική τους φωνή.",
          },
          {
            name: "ΠΑΡΑΜΥΘΟΛΟΓΩΝΤΑΣ",
            text: "Εργαστήρια αφήγησης για εκπαιδευτικούς και γονείς.",
          },
        ] satisfies Collaboration[],
      },
      {
        numeral: "II",
        title: "Δίκτυα",
        items: [
          {
            name: "European Fairy Tale Route",
            text: "Ευρωπαϊκό δίκτυο που ενώνει τόπους, ανθρώπους και παραμύθια.",
          },
          {
            name: "Λέσχη Αφήγησης Θεσσαλονίκης",
            text: "Η κοινότητα όπου μελετάμε και μοιραζόμαστε την τέχνη της αφήγησης.",
          },
        ] satisfies Collaboration[],
      },
      {
        numeral: "III",
        title: "Φεστιβάλ & συνέδρια",
        items: [
          {
            name: "Φεστιβάλ Πηλίου",
            text: "Αφηγήσεις στις πλατείες του Πηλίου, για μικρούς και μεγάλους.",
          },
          {
            name: "Διεθνές Φεστιβάλ Αφήγησης",
            text: "Όνομα και περιγραφή από την ομάδα.",
            placeholder: true,
          },
          {
            name: "Συνέδριο Προφορικής Παράδοσης",
            text: "Όνομα και περιγραφή από την ομάδα.",
            placeholder: true,
          },
          {
            name: "Φεστιβάλ Παιδικού Βιβλίου",
            text: "Όνομα και περιγραφή από την ομάδα.",
            placeholder: true,
          },
        ] satisfies Collaboration[],
      },
    ],
  },
};
