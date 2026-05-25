import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["eslint.config.mjs"],
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2022,
      globals: {
        process: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      },
    },
  },
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2022,
    },
  },
]);
