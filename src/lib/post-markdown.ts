/**
 * Markdown additions for post bodies (src/content/news), registered in
 * astro.config.mjs. Styled in src/components/news/PostBody.astro.
 *
 * - The first paragraph starts with a drop cap. Screen readers get the first
 *   word whole; the boxed letter is only visual.
 * - An image alone in its paragraph becomes a figure; its title (the quoted
 *   text in `![alt](./photo.jpg "caption")`) becomes the caption.
 * - A quote becomes a figure; a last line starting with "–" (an en dash)
 *   becomes its attribution: `> – μια μητέρα από τον Βόλο`.
 *
 * With Sanity, PostBody renders the same markup from Portable Text instead.
 */
import type { Element, ElementContent, RootContent } from "hast";
import { defineHastPlugin } from "satteri";

const ATTRIBUTION = /^–\s*/;

const isBlank = (node: RootContent) =>
  node.type === "text" && !node.value.trim();

const element = (
  tagName: string,
  className: string | undefined,
  children: ElementContent[],
): Element => ({
  type: "element",
  tagName,
  properties: className ? { className: [className] } : {},
  children,
});

/** `<p>Φέτος το…` becomes `<p>[Φέτος hidden][Φ boxed + έτος, aria-hidden] το…`. */
function withInitial(paragraph: Readonly<Element>): Element | undefined {
  const [first, ...rest] = paragraph.children;
  if (first?.type !== "text") return;
  const match = /^(\p{L})(\S*)/u.exec(first.value);
  if (!match) return;
  const [word, letter, tail] = match;
  return {
    ...paragraph,
    properties: { ...paragraph.properties, className: ["has-initial"] },
    children: [
      element("span", "visually-hidden", [{ type: "text", value: word }]),
      {
        ...element("span", undefined, [
          element("span", "initial", [{ type: "text", value: letter }]),
          { type: "text", value: tail },
        ]),
        properties: { ariaHidden: "true" },
      },
      { type: "text", value: first.value.slice(word.length) },
      ...rest,
    ],
  };
}

/** A paragraph holding one image becomes a figure with its title as caption. */
function asFigure(paragraph: Readonly<Element>): Element | undefined {
  const content = paragraph.children.filter((node) => !isBlank(node));
  const image = content[0];
  if (content.length !== 1 || image.type !== "element") return;
  if (image.tagName !== "img") return;
  const { title, ...properties } = image.properties;
  const caption =
    typeof title === "string" && title.trim()
      ? [element("figcaption", undefined, [{ type: "text", value: title }])]
      : [];
  return element("figure", undefined, [{ ...image, properties }, ...caption]);
}

/** A quote becomes a figure, with its "– name" line as the caption. */
function asQuote(quote: Readonly<Element>): Element {
  const blocks = quote.children.filter((node) => !isBlank(node));
  const last = blocks[blocks.length - 1];
  const lead = last?.type === "element" ? last.children[0] : undefined;
  if (
    blocks.length > 1 &&
    last.type === "element" &&
    last.tagName === "p" &&
    lead?.type === "text" &&
    ATTRIBUTION.test(lead.value)
  ) {
    return element("figure", "quote", [
      { ...quote, children: blocks.slice(0, -1) },
      element("figcaption", undefined, [
        { type: "text", value: lead.value.replace(ATTRIBUTION, "") },
        ...last.children.slice(1),
      ]),
    ]);
  }
  return element("figure", "quote", [{ ...quote, children: blocks }]);
}

export const postMarkdown = defineHastPlugin({
  name: "post-markdown",
  element: [
    {
      filter: ["p"],
      visit(node, ctx) {
        const figure = asFigure(node);
        if (figure) return ctx.replaceNode(node, figure);
        const parent = ctx.parent(node);
        if (parent.type !== "root") return;
        const first = parent.children.findIndex((child) => !isBlank(child));
        if (ctx.indexOf(node) !== first) return;
        const paragraph = withInitial(node);
        if (paragraph) ctx.replaceNode(node, paragraph);
      },
    },
    {
      filter: ["blockquote"],
      visit(node, ctx) {
        if (ctx.parent(node).type === "root")
          ctx.replaceNode(node, asQuote(node));
      },
    },
  ],
});
