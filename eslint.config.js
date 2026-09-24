import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

// Written as an escape so this file does not trip its own rule.
const emDash = "/\\u2014/";
const noEmDash = "Do not use em dashes (U+2014) in copy.";

export default defineConfig(
  { ignores: ["dist/", ".astro/", "node_modules/", "design/"] },
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs["flat/recommended"],
  astro.configs["flat/jsx-a11y-recommended"],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Safari/VoiceOver drops list semantics when list-style is none, so
      // unstyled lists keep an explicit role="list".
      "astro/jsx-a11y/no-redundant-roles": ["error", { ul: ["list"] }],
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=${emDash}]`, message: noEmDash },
        { selector: `TemplateElement[value.raw=${emDash}]`, message: noEmDash },
        { selector: `JSXText[value=${emDash}]`, message: noEmDash },
      ],
    },
  },
);
