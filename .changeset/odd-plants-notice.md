---
'@arcanejs/react-toolkit': minor
'@arcanejs/toolkit': minor
---

**BREAKING:** Update Switch and SliderButton to support controlled/uncontrolled

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
