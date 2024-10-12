const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", 'plugin:@typescript-eslint/recommended', "prettier", "turbo"],
  plugins: ["only-warn", "jest"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    "jest/globals": true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
    "coverage/",
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", {
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_",
    }],
  },
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
    {
      files: ["*.test.js?(x)", "*.test.ts?(x)"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      }
    },
  ],
};
