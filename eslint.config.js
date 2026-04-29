import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 🔥 Desliga regras que conflitam com Prettier
  prettierConfig,

  {
    plugins: {
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Prettier como regra do ESLint
      "no-unused-vars": "warn",
      "no-console": "warn",
      // Sort imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
]);
