---
'@arcanejs/diff': minor
---

Optimize value changes

Don't include the previous value in a calculated diff when its entire value
needs to be replaced, as this is not used to calculate the new value,
and only serves to bloat the diff sizes.
