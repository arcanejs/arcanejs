---
'@arcanejs/diff': minor
---

Allow diffing values of different types

Previously, when there were different types for a value, we weren't able to
compare then and provide a patch.
Now it simply includes the entire new value.
