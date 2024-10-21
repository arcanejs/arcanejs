# ArcaneJS

Allows you to quickly create real-time control panels
for your JavaScript / TypeScript single-server apps,
using a custom react renderer, and WebSockets.

Control panels can be accessed by any number of
browsers / devices / clients simultaneously,
and changes caused by any client will be immediately propagated to all other
clients.

The UI has also been designed primarily with touch devices in mind,
but also works well with a cursor and keyboard.

<p align="center">
  <img src="./packages/react-toolkit/docs/architecture.svg" alt="Architecture Diagram">
</p>

## Status / Suitability / Security Disclaimer

This project is **experimental**,
and takes advantage of unstable `react` APIs exposed via `react-render`.
It's not suitable for production or commercial projects yet,
especially those that rely on regular updates of dependencies
for security reasons,
as usage of this project may make it difficult to keep `react` up-to-date
(that being said, the license does not prohibit this,
so feel free to at-your-own-risk).

There are also no authentication mechanisms implemented yet,
so be careful when exposing your control panels over the network,
as this will allow anyone to interact with your processes.

## Why

Sometimes you're working on relatively simple local applications or scripts,
and would like to have a way to interact with the state or configuration
of these applications in real-time,
for example:

- Lighting control or AV systems
- Home-Automation or Office building management and operation

### Why Not

This project is not designed to be a general-purpose application framework,
in particular, it's not suitable for any project / application that:

- Needs to scale beyond a single Node.js process
- Is stateless _(It's explicitly designed to manage in-memory state)_
- Will be exposed over the internet _(no authentication has been implemented)_

## [Usage](./packages/react-toolkit/#usage)

For usage,
head to the [`@arcanejs/react-toolkit` documentation](./packages/react-toolkit/README.md#usage),
which is the primary entry-point into the project.

## `@arcanejs` the wild

The primary motivation for building this project was to power a custom
DMX lighting control system that has been used for running lighting
for live music events,
synchronized with the BPM from Pioneer DJ systems using ProLink.

The application allowed for the composition of new sequences **while running**,
and smoothly transitioning between them,
(the same thing you'd expect to be able to do
from a dynamic frontend react application).

See this instagram account to see what this looks like in real-life:
https://www.instagram.com/LightningParadox/

The full source-code for this application is not currently public,
but I intend to open-source it in the future.

## [Examples](./examples/react/)

For a comprehensive list of examples,
please see the [react example directory](./examples/react/).
