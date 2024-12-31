---
'@arcanejs/toolkit': patch
---

Fix issue with fonts being re-downloaded

Custom fonts used for the material icons would be re-downloaded every
time styled-components updated the styling for anything.

As a result, there's a flash-of-unstyled-content during this time,
which causes the whole layout to shift.
