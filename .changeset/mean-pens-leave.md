---
'@arcanejs/react-toolkit': minor
---

**BREAKING:** Refactor the data file interface for easier direct use with hooks

`createDataFileSpec` has been renamed to `createDataFileDefinition`
`useDataFile` has been renamed to `useDataFileContext`,
and `useDataFile` is now used to directly use the hooks without a provider.
