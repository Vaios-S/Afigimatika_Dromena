/**
 * The letter form on /proskaleste-mas.
 *
 * Without this script the form still works: the browser checks the required
 * fields and the form POSTs to Web3Forms, which redirects back to
 * #letter-sent (shown with CSS :target).
 *
 * With it: validation with our own wording, errors under the line linked by
 * aria-describedby, focus on the first invalid field, sending with fetch, and
 * the sending / success / failure states, announced to screen readers.
 * All visible text comes from the page (data attributes and templates).
 *
 * Dev only: add ?simulate=success or ?simulate=failure to the URL to try the
 * states without a Web3Forms key. The check is behind import.meta.env.DEV,
 * which is false in production builds, so the code is removed there.
 */

/* ==========================================================================
   Tunables
   ========================================================================== */

/** Give up on the request after this long (ms) and show the failure state. */
const TIMEOUT = 15000;

/** Dev simulation: how long the fake request takes (ms). */
const SIMULATED_DELAY = 1600;

/** A practical email check: something@something.tld (2+ letters). */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ==========================================================================
   Implementation
   ========================================================================== */

type Outcome = "success" | "failure" | "not-configured";

interface Parts {
  form: HTMLFormElement;
  section: HTMLElement;
  button: HTMLButtonElement;
  /** Polite live region under the button ("sending"). */
  status: HTMLElement;
  /** role="alert" region for the failure message. */
  alert: HTMLElement;
  failure: HTMLTemplateElement;
  /** Thank-you panel. */
  sent: HTMLElement;
  again: HTMLAnchorElement | null;
  name: HTMLInputElement;
  email: HTMLInputElement;
  organization: HTMLInputElement | null;
  city: HTMLInputElement | null;
}

function init({
  form,
  section,
  button,
  status,
  alert,
  failure,
  sent,
  again,
  name,
  email,
  organization,
  city,
}: Parts) {
  const text = form.dataset;
  const errors = {
    name: name.closest(".blank")?.querySelector<HTMLElement>(".error"),
    email: email.closest(".blank")?.querySelector<HTMLElement>(".error"),
  };

  // Our own validation messages replace the browser's bubbles.
  form.noValidate = true;
  let sending = false;

  function setError(
    input: HTMLInputElement,
    error: HTMLElement | null | undefined,
    message: string,
  ) {
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    if (error) error.textContent = message;
  }

  function validate(): HTMLInputElement[] {
    const invalid: HTMLInputElement[] = [];
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const nameMessage = nameValue ? "" : (name.dataset.errorMissing ?? "");
    const emailMessage = !emailValue
      ? (email.dataset.errorMissing ?? "")
      : EMAIL.test(emailValue)
        ? ""
        : (email.dataset.errorFormat ?? "");
    setError(name, errors.name, nameMessage);
    setError(email, errors.email, emailMessage);
    if (nameMessage) invalid.push(name);
    if (emailMessage) invalid.push(email);
    return invalid;
  }

  // An error clears as soon as the person edits that field.
  for (const [input, error] of [
    [name, errors.name],
    [email, errors.email],
  ] as const) {
    input.addEventListener("input", () => {
      if (input.hasAttribute("aria-invalid")) setError(input, error, "");
    });
  }

  function setSending(on: boolean) {
    sending = on;
    form.setAttribute("aria-busy", String(on));
    // aria-disabled (not disabled) keeps the button focusable while sending.
    if (on) button.setAttribute("aria-disabled", "true");
    else button.removeAttribute("aria-disabled");
    button.textContent = on ? (text.sending ?? "") : (text.submit ?? "");
    status.textContent = on ? (text.sendingNote ?? "") : "";
  }

  function showFailure(message?: string) {
    alert.replaceChildren();
    if (message) {
      alert.textContent = message;
    } else {
      alert.append(failure.content.cloneNode(true));
    }
    button.textContent = text.retry ?? "";
  }

  function showSuccess(address: string) {
    const plain = sent.querySelector<HTMLElement>("[data-sent-plain]");
    const withEmail = sent.querySelector<HTMLElement>("[data-sent-email]");
    const slot = sent.querySelector<HTMLElement>("[data-sent-address]");
    if (plain && withEmail && slot) {
      slot.textContent = address;
      plain.hidden = true;
      withEmail.hidden = false;
    }
    section.classList.add("is-sent");
    sent.focus();
  }

  function subject() {
    const place = [organization?.value.trim(), city?.value.trim()]
      .filter(Boolean)
      .join(", ");
    return (text.subject ?? "")
      .replace("{name}", name.value.trim())
      .replace(/,?\s*\{place\}/, place ? `, ${place}` : "");
  }

  async function send(): Promise<Outcome> {
    if (import.meta.env.DEV) {
      const simulate = new URLSearchParams(location.search).get("simulate");
      if (simulate === "success" || simulate === "failure") {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
        return simulate;
      }
    }

    const data = new FormData(form);
    if (!data.get("access_key")) {
      return import.meta.env.DEV ? "not-configured" : "failure";
    }
    data.set("subject", subject());
    data.set("from_name", name.value.trim());
    data.delete("redirect");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const result = (await response.json()) as { success?: boolean };
      return response.ok && result.success ? "success" : "failure";
    } catch {
      return "failure";
    } finally {
      clearTimeout(timer);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const invalid = validate();
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    alert.replaceChildren();
    setSending(true);
    const outcome = await send();
    setSending(false);

    if (outcome === "success") showSuccess(email.value.trim());
    else if (outcome === "not-configured") showFailure(text.notConfigured);
    else showFailure();
  });

  // "Νέο γράμμα": back to an empty letter (a plain #letter link without JavaScript).
  again?.addEventListener("click", (event) => {
    event.preventDefault();
    form.reset();
    alert.replaceChildren();
    button.textContent = text.submit ?? "";
    section.classList.remove("is-sent");
    if (location.hash === "#letter-sent")
      history.replaceState(null, "", location.pathname + location.search);
    name.focus();
  });
}

const form = document.querySelector<HTMLFormElement>("form[data-letter]");
const q = <T extends Element>(
  selector: string,
  root: ParentNode | null | undefined = form,
) => root?.querySelector<T>(selector) ?? null;
const parts = {
  form,
  section: form?.closest<HTMLElement>(".letter") ?? null,
  button: q<HTMLButtonElement>('button[type="submit"]'),
  status: q<HTMLElement>("[data-status]"),
  alert: q<HTMLElement>("[data-alert]"),
  failure: q<HTMLTemplateElement>("template[data-failure]"),
  sent: q<HTMLElement>("[data-sent]", document),
  again: q<HTMLAnchorElement>("[data-again]", document),
  name: q<HTMLInputElement>('[data-field="name"]'),
  email: q<HTMLInputElement>('[data-field="email"]'),
  organization: q<HTMLInputElement>('[data-field="organization"]'),
  city: q<HTMLInputElement>('[data-field="city"]'),
};
const { section, button, status, alert, failure, sent, name, email } = parts;
if (
  form &&
  section &&
  button &&
  status &&
  alert &&
  failure &&
  sent &&
  name &&
  email
) {
  init({
    ...parts,
    form,
    section,
    button,
    status,
    alert,
    failure,
    sent,
    name,
    email,
  });
}
