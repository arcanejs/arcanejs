# @toolkit-frontend

## 0.6.0

### Minor Changes

- 6c607cd: Allow theme to be specified in startArcaneFrontend

## 0.5.0

### Minor Changes

- 911f3db: Add light-mode support

  Introduce a LIGHT_THEME and use prefers-color-scheme to
  pick between a light and dark mode.

## 0.4.0

### Minor Changes

- 11701df: Add the connection UUID to StageContext

### Patch Changes

- Updated dependencies [11701df]
  - @arcanejs/protocol@0.5.0

## 0.3.1

### Patch Changes

- 30aea22: Fix dependencies, and remove unnecessary external config in tsup
- Updated dependencies [30aea22]
  - @arcanejs/protocol@0.4.1

## 0.3.0

### Minor Changes

- 9d3919e: Allow for custom components to be defined

  This change comes with quite a few internal and architectural refactors to allow
  for custom components to be defied both in the `toolkit` and `react-toolkit`
  packages.

  Including:

  - Updating the protocol to include a namespace attribute for every component
  - Introducing the `FrontendComponentRenderer` interface in `toolkit-frontend`
  - Migrating the `core` components frontend implementation to
    `toolkit-frontend` as an instance of `FrontendComponentRenderer`
  - In `toolkit`: allowing for custom frontend entrypoint javascript files to be
    loaded instead of the default one
    (which only includes the core `FrontendComponentRenderer`).
  - Migrating logic handling for adding / removing listeners based on props into
    `toolkit` backend modules rather than having hard-coded handling in
    `react-toolkit`.
  - Refactoring `react-toolkit` to allow for component namespaces to be defined,
    by:
    - Introducing a new component registry concept,
      and exposing a helper function `prepareComponents` to create components
      object that can be used directly in react.
    - Migrating all core-component-specific logic to use this new registry logic.
  - Introducing an example app (`custom-components`)
    that defines a custom component, and demonstrates usage, including:
    - receiving messages from users
    - nesting and displaying other components
    - using `ref` to directly interact with the backend implementation

### Patch Changes

- f50dc39: Reorder package exports to remove esbuild warnings
- Updated dependencies [9d3919e]
- Updated dependencies [f50dc39]
  - @arcanejs/protocol@0.4.0

## 0.2.0

### Minor Changes

- 7c4379d: Allow Rect and SliderButtons to grow
- 7c4379d: Introduce gradients on SliderButton

### Patch Changes

- 7c4379d: Improve display of SliderButton and Rect when vertical
- Updated dependencies [7c4379d]
- Updated dependencies [7c4379d]
  - @arcanejs/protocol@0.3.0

## 0.1.0

### Minor Changes

- 9247670: Remove console.log and introduce unified logging interface

### Patch Changes

- Updated dependencies [9247670]
  - @arcanejs/protocol@0.2.0

## 0.0.3

### Patch Changes

- bc83786: Fix imports by ensuring we split all bundles
  - @arcanejs/protocol@0.1.1

## 0.0.2

### Patch Changes

- 2598016: Switch to uncontrolled input for TextInput to address cursor bugs
- d99b44e: Introduce toolkit frontend
- df70fb5: Ensure 3rd party deps are not bundled
- Updated dependencies [d99b44e]
  - @arcanejs/protocol@0.1.1
