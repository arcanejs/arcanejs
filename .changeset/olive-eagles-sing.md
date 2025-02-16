---
'@arcanejs/react-toolkit': minor
---

Use ReactNode for all children

Avoid causing type errors in TypeScript when certain types of elements or
components are given as children even though react can render them properly
by using `ReactNode` everywhere.
