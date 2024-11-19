# @arcanejs/react-toolkit

## 0.7.0

### Minor Changes

- 52fb995: Introduce lastUpdatedMillis for data module

  Expose the last time that a data file was updated in-memory as a property of the
  context exposed in the API.

## 0.6.1

### Patch Changes

- @arcanejs/protocol@0.3.0
- @arcanejs/toolkit@0.5.1

## 0.6.0

### Minor Changes

- 7c4379d: Introduce new `HslColorPicker` composite component

  Introduce a new component that can be used to select different colors,
  build from `Group`, `Rect` and `SliderButton` components.

### Patch Changes

- Updated dependencies [7c4379d]
- Updated dependencies [7c4379d]
- Updated dependencies [7c4379d]
  - @arcanejs/toolkit@0.5.0
  - @arcanejs/protocol@0.3.0

## 0.5.0

### Minor Changes

- a053abb: **BREAKING:** Update Switch and SliderButton to support controlled/uncontrolled

  Update the properties for both SliderButton and Switch so that they can both
  maintain internal state, and also support being explicitly controlled:

  - For controlled inputs: `value` should be used
  - For uncontrolled inputs:

    - `defaultValue` can be used to set the initial value
    - The value of the input will change automatically,
      but if it needs to be overridden,
      `ref` can be used along with `setValue()`.

  `TextInput` is not affected by this change as it always needs to maintain an
  uncontrolled experience in the frontend, and we need to think-through a bit how
  this will work in the backend.

### Patch Changes

- 027c764: Use vertical group be default for root group
- Updated dependencies [a053abb]
  - @arcanejs/toolkit@0.4.0

## 0.4.1

### Patch Changes

- 2ac2928: Fix tsup config and missing bundle

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
