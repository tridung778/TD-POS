import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: [
      "**/.next",
      "**/dist",
      "**/.prisma",
      "node_modules",
      "prisma/generated",
      "*.config.{js,ts,mjs}",
    ],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tsEslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
    plugins: { import: importPlugin },
  }
);
