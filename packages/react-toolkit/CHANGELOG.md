# @arcanejs/react-toolkit

## 0.4.0

### Minor Changes

- 9247670: Remove console.log and introduce unified logging interface

### Patch Changes

- Updated dependencies [9247670]
  - @arcanejs/protocol@0.2.0
  - @arcanejs/toolkit@0.3.0

## 0.3.2

### Patch Changes

- bc83786: Fix imports by ensuring we split all bundles
- Updated dependencies [bc83786]
  - @arcanejs/toolkit@0.2.2

## 0.3.1

### Patch Changes

- 41cbac3: Fix dependency definition for react-reconciler

## 0.3.0

### Minor Changes

- 390ace0: **BREAKING:** Refactor the data file interface for easier direct use with hooks

  `createDataFileSpec` has been renamed to `createDataFileDefinition`
  `useDataFile` has been renamed to `useDataFileContext`,
  and `useDataFile` is now used to directly use the hooks without a provider.

## 0.2.0

### Minor Changes

- df70fb5: Introduce a new module, hooks and components for storing data as json files

  Introduce `createDataFileSpec` alongside hooks `useDataFile`, `useDataFileData`
  and `useDataFileUpdater`, which allows for easily composing applications that
  need to persist data across one or more files.

- df70fb5: Allow using ref for all components

### Patch Changes

- df70fb5: Ensure 3rd party deps are not bundled
- Updated dependencies [df70fb5]
  - @arcanejs/toolkit@0.2.1

## 0.1.5

### Patch Changes

- Fix images display in README

## 0.1.4

### Patch Changes

- Update docs

## 0.1.3

### Patch Changes

- Update docs with architacture diagram

## 0.1.2

### Patch Changes

- ce0958d: Flesh out Button and Group docs
- Updated dependencies [efc76ba]
  - @arcanejs/toolkit@0.2.0

## 0.1.1

### Patch Changes

- adfbcbf: Flesh out documentation for packages
- Updated dependencies [adfbcbf]
  - @arcanejs/toolkit@0.1.1

## 0.1.0

### Minor Changes

- f54f4f5: Initial implementation

### Patch Changes

- Updated dependencies [f54f4f5]
  - @arcanejs/toolkit@0.1.0
