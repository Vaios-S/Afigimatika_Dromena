/**
 * Copy for the "Προσκαλέστε μας" page (/proskaleste-mas). Components read
 * text from here; none is hardcoded. Contact details come from contact.ts,
 * and the ages statement and places frieze (shared with the homepage) from
 * site.ts. Labels shown in capitals are stored in normal case.
 * Never use em dashes in copy (ESLint enforces this).
 */

interface BundleItem {
  text: string;
  /** Drawing: a file in src/assets/ornaments, without ".svg". */
  icon: string;
}

interface Question {
  question: string;
  answer: string;
  /** Answer not yet confirmed with the group: shows the placeholder tag. */
  placeholder?: boolean;
}

export const invite = {
  meta: {
    title: "Προσκαλέστε μας",
    description:
      "Προσκαλέστε τα Αφηγηματικά Δρώμενα σε σχολείο, βιβλιοθήκη, φεστιβάλ ή όπου αλλού θέλετε να ακουστεί ένα παραμύθι. Κάθε αφήγηση πλάθεται για το κοινό και τον χώρο σας.",
  },

  intro: {
    label: "Προσκαλέστε μας",
    title: { text: "Ένα παραμύθι φτιαγμένο", accent: "για τον χώρο σας" },
    text: "Δεν έχουμε έτοιμο πρόγραμμα για να διαλέξετε. Κάθε αφήγηση πλάθεται από την αρχή, για το κοινό, τον χώρο και την περίσταση που μας καλεί.",
    placeholder: true,
    questionsTitle: "Κάθε αφήγηση ξεκινά από τρεις ερωτήσεις",
    questions: [
      "Ποιος θα ακούσει;",
      "Πού θα ειπωθεί η ιστορία;",
      "Με ποια αφορμή;",
    ],
    /** Link down to the letter form. */
    toForm: "Στείλτε μας τις απαντήσεις σας",
  },

  bundle: {
    kicker: "Το μπογαλάκι των αφηγητριών",
    title: {
      text: "Δεν χρειαζόμαστε πολλά",
      accent: "για να ξεκινήσει ένα παραμύθι.",
    },
    placeholder: true,
    bring: {
      title: "Τι φέρνουμε εμείς",
      items: [
        { text: "τις φωνές μας", icon: "bundle-lantern" },
        { text: "τις ιστορίες", icon: "bundle-book" },
        { text: "μουσική, όταν ταιριάζει", icon: "bundle-drum" },
        { text: "μια αφήγηση πλασμένη για το κοινό σας", icon: "bundle-spool" },
      ] satisfies BundleItem[],
    },
    need: {
      title: "Τι χρειαζόμαστε από εσάς",
      items: [
        { text: "έναν χώρο", icon: "bundle-door" },
        { text: "λίγη ησυχία", icon: "bundle-moon" },
        { text: "τους ακροατές σας", icon: "bundle-listeners" },
        {
          text: "μια θέση για τον καθένα, καρέκλα ή μαξιλάρι στο πάτωμα",
          icon: "bundle-seat",
        },
      ] satisfies BundleItem[],
    },
  },

  letter: {
    kicker: "Γράψτε μας",
    title: "Ένα γράμμα για την αφήγησή σας",
    text: "Μας γράφετε, μιλάμε για το κοινό και τον χώρο σας, και ετοιμάζουμε μια αφήγηση μόνο για εσάς.",
    placeholder: true,
    formLabel: "Γράμμα πρόσκλησης",
    direct: "Ή γράψτε μας απευθείας",
    required: "απαραίτητο",
    /**
     * The letter, in reading order. Each sentence is plain text; each blank is
     * a field whose caption (under the line) is its label.
     */
    fields: {
      name: { before: "Γεια σας, με λένε", caption: "όνομα" },
      organization: {
        before: "και γράφω από",
        caption: "φορέας ή χώρος",
        placeholder: "π.χ. βιβλιοθήκη",
      },
      city: { before: "στην", caption: "πόλη", after: "." },
      audience: {
        before: "Θα θέλαμε μια αφήγηση για",
        caption: "για ποιους και ποιες ηλικίες",
        placeholder: "π.χ. παιδιά 6 έως 9",
      },
      when: {
        before: "γύρω στις",
        caption: "ημερομηνία ή περίοδος",
        placeholder: "π.χ. Μάιος",
        after: ".",
      },
      message: {
        before: "Λίγα λόγια ακόμα:",
        caption: "για το κοινό, τον χώρο ή την αφορμή",
      },
      email: { before: "Μπορείτε να μου απαντήσετε στο", caption: "email" },
      phone: { before: "ή στο", caption: "τηλέφωνο", after: "." },
    },
    errors: {
      name: "Πώς να σας λέμε; Γράψτε μας το όνομά σας.",
      email: "Χρειαζόμαστε ένα email για να σας απαντήσουμε.",
      emailFormat: "Κάτι λείπει σε αυτό το email. Ελέγξτε το μέρος μετά το @.",
    },
    submit: "Αποστολή",
    sending: "Στέλνεται…",
    sendingNote: "Το γράμμα σας ταξιδεύει…",
    retry: "Δοκιμάστε ξανά",
    privacy:
      "Τα στοιχεία σας τα διαβάζουμε μόνο εμείς, για να σας απαντήσουμε.",
    success: {
      title: "Το γράμμα σας έφτασε.",
      /** The sender's email is added after this text. */
      text: "Θα σας απαντήσουμε σύντομα, στο",
      /** Without JavaScript the email is unknown, so this text is shown instead. */
      textNoEmail: "Θα σας απαντήσουμε σύντομα.",
      again: "Νέο γράμμα",
    },
    /** The group's email address is added after this text. */
    failure:
      "Το γράμμα σας δεν έφυγε, κάτι πήγε στραβά από τη μεριά μας. Δοκιμάστε ξανά ή στείλτε το απευθείας στο",
    notConfigured:
      "Η φόρμα δεν έχει ρυθμιστεί ακόμα: λείπει το PUBLIC_WEB3FORMS_KEY (δείτε το .env.example).",
    /** Subject of the email the group receives; {name} and {place} are filled in. */
    subject: "Πρόσκληση: {name}, {place}",
    /** Subject when JavaScript is off and the fields can't be combined. */
    subjectNoJs: "Πρόσκληση από τον ιστότοπο",
  },

  faq: {
    label: "Συχνές ερωτήσεις",
    title: "Πριν μας καλέσετε",
    /** Every answer must be confirmed with the group; remove a question by deleting its entry. */
    questions: [
      {
        question: "Πόσο κοστίζει μια αφήγηση;",
        answer:
          "Το κόστος εξαρτάται από τη διάρκεια, τον αριθμό των αφηγητριών και την απόσταση. Γράψτε μας και σας στέλνουμε προσφορά μέσα σε λίγες μέρες.",
        placeholder: true,
      },
      {
        question: "Πόσο νωρίς πρέπει να σας καλέσουμε;",
        answer:
          "Ιδανικά τέσσερις με έξι εβδομάδες πριν. Για φεστιβάλ και σχολικά προγράμματα, όσο νωρίτερα τόσο καλύτερα.",
        placeholder: true,
      },
      {
        question: "Πόσο διαρκεί μια αφήγηση;",
        answer:
          "Από 30 έως 90 λεπτά: μία σχολική ώρα, ένα απόγευμα σε βιβλιοθήκη ή μια βραδιά σε καφέ.",
        placeholder: true,
      },
      {
        question: "Πόσοι ακροατές χωράνε;",
        answer:
          "Ιδανικά έως 50, κοντά μας σε κύκλο ή ημικύκλιο. Για μεγαλύτερο κοινό, χωρίζουμε σε ομάδες.",
        placeholder: true,
      },
      {
        question: "Χρειάζεται μικρόφωνο ή ήχος;",
        answer:
          "Για έως 50 ακροατές, όχι. Για μεγάλο κοινό ή ανοιχτό χώρο, ένα απλό σύστημα ήχου, που μπορούμε να φέρουμε κι εμείς.",
        placeholder: true,
      },
      {
        question: "Τι χρειάζεται ο χώρος;",
        answer:
          "Έναν ήσυχο χώρο, καθίσματα ή μαξιλάρια για το κοινό και λίγο χρόνο πριν για να τον στήσουμε μαζί. Δεν χρειαζόμαστε σκηνή.",
        placeholder: true,
      },
      {
        question: "Για ποιες ηλικίες αφηγείστε;",
        answer:
          "Για όλες, από τεσσάρων ετών και πάνω. Συχνά στο ίδιο κοινό κάθονται παιδιά, γονείς και παππούδες, και διαλέγουμε τα παραμύθια για όσους θα είναι εκεί.",
        placeholder: true,
      },
      {
        question: "Ταξιδεύετε εκτός Θεσσαλονίκης;",
        answer:
          "Ναι, σε όλη την Ελλάδα και στο εξωτερικό. Τα έξοδα μετακίνησης εκτός Θεσσαλονίκης συμφωνούνται από πριν, μαζί με την υπόλοιπη οργάνωση.",
        placeholder: true,
      },
    ] satisfies Question[],
  },
};
