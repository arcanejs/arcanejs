module.exports = {
  SHARED_RULES: {
    "@typescript-eslint/no-unused-vars": ["warn", {
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_",
    }],
    "no-console": "error",
    "no-restricted-imports": ["error", {
      "patterns": [{
        "group": ["**/packages/"],
        "message": "Please import from public package API instead, otherwise example may not be usable by others.",
      }],
    }]
  }
}