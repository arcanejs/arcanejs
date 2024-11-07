# @arcanejs/toolkit

## 0.5.0

### Minor Changes

- 7c4379d: Allow Rect and SliderButtons to grow
- 7c4379d: Introduce gradients on SliderButton

### Patch Changes

- 7c4379d: Improve display of SliderButton and Rect when vertical
- Updated dependencies [7c4379d]
- Updated dependencies [7c4379d]
  - @arcanejs/protocol@0.3.0

## 0.4.0

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

## 0.3.0

### Minor Changes

- 9247670: Remove console.log and introduce unified logging interface

### Patch Changes

- Updated dependencies [9247670]
  - @arcanejs/protocol@0.2.0
  - @arcanejs/diff@0.4.0

## 0.2.2

### Patch Changes

- bc83786: Fix imports by ensuring we split all bundles
- Updated dependencies [bc83786]
  - @arcanejs/diff@0.3.2
  - @arcanejs/protocol@0.1.1

## 0.2.1

### Patch Changes

- df70fb5: Ensure 3rd party deps are not bundled
- Updated dependencies [d99b44e]
  - @arcanejs/protocol@0.1.1

## 0.2.0

### Minor Changes

- efc76ba: Removed unused prop headerComponents

## 0.1.1

### Patch Changes

- adfbcbf: Flesh out documentation for packages
- Updated dependencies [adfbcbf]
  - @arcanejs/diff@0.3.1

## 0.1.0

### Minor Changes

- f54f4f5: Initial implementation

## 0.0.3

### Patch Changes

- 3607779: Use non-strict version for workspace packages

## 0.0.2

### Patch Changes

- Updated dependencies [fe0d7fb]
- Updated dependencies [6424c0a]
  - @arcanejs/diff@0.3.0
