/**
 * The single source for contact details and the site URL.
 * Every component reads from here; nothing is hardcoded elsewhere.
 *
 * PLACEHOLDERS: every value below comes from the design tool and must be
 * replaced with the real details before launch.
 */
export const contact = {
  /** PLACEHOLDER. The domain is not decided yet (.example is a reserved TLD). */
  siteUrl: "https://afigimatika-dromena.example",
  /** PLACEHOLDER */
  email: "info@afigimatika-dromena.gr",
  /** PLACEHOLDER. Display format; the tel: link is derived from it. */
  phone: "+30 231 000 0000",
  /** PLACEHOLDER */
  address: "Οδός Παραδείγματος 1, 546 00",
  /** PLACEHOLDER */
  city: "Θεσσαλονίκη",
  /** ISO country code, used in structured data. */
  country: "GR",
  /** PLACEHOLDER URLs */
  social: [
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
} as const;

export const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
export const emailHref = `mailto:${contact.email}`;
