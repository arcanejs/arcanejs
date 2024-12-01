const { resolve } = require("node:path");
const { SHARED_RULES } = require("./shared-rules");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    'plugin:@typescript-eslint/recommended',
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
    "jest/globals": true,
  },
  plugins: ["only-warn", "jest"],
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
    "coverage/",
  ],
  "rules": SHARED_RULES,
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
