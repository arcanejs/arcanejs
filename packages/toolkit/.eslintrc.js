/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@arcanejs/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
  "overrides": [
    {
      "files": ["src/frontend/**/*"],
      "rules": {
        // This code is only used in the frontend, and the only code present
        // Loggers aren't available here, so console logging is okay
        "no-console": "off",
      }
    }
  ]
};
