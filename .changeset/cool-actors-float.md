---
'@arcanejs/toolkit-frontend': minor
'@arcanejs/react-toolkit': minor
'@arcanejs/protocol': minor
'@arcanejs/toolkit': minor
---

Allow for custom components to be defined

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
