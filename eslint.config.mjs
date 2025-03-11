import pluginNext from "@next/eslint-plugin-next";
import jestPlugin from "eslint-plugin-jest";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
      jest: jestPlugin,
      "react-hooks": reactHooks,
      react,
    },
    ignores: ["node_modules", "dist", "build", "public"],
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        {
          blankLine: "always",
          prev: "*",
          next: ["function", "class", "export", "block", "block-like"],
        },
        { blankLine: "always", prev: "block", next: "*" },
      ],
      "@next/next/no-html-link-for-pages": ["error"],
      "relay/generated-flow-types": "off",
      "no-console": [
        "error",
        {
          allow: ["warn", "error", "info"],
        },
      ],
      eqeqeq: "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-children-prop": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    name: "next",
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "@next/next/no-duplicate-head": "off",
    },
  },
  {
    // enable jest rules on test files
    files: ["src/**/*.test.ts"],
    ...jestPlugin.configs["flat/recommended"],
  }
);
