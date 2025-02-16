---
'@arcanejs/toolkit': minor
---

Introduce ability to listen to connection changes

Expose the `Connection` interface,
and listeners on the `Toolkit` class that can be used to listen to
new or closed connections to the Toolkit.
In addition to a `getConnections()` method.
