---
'@arcanejs/react-toolkit': patch
---

Add compatibility for ZodError types in data module

Previously, usage of `.catch()` in type definitions would result in
type-inference for `createDataFileDefinition` failing as it's unable to infer the
types automatically when a `ZodError` type exists in the type def,
defaulting instead to `unknown`.

This change adjusts the way we do type inference for these types,
and always uses `z.infer<>` to extract the actual type from the zod type
definition.
