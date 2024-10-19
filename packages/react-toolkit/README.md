# `@arcanejs/react-toolkit`

[![NPM Version](https://img.shields.io/npm/v/%40arcanejs%2Freact-toolkit)](https://www.npmjs.com/package/@arcanejs/react-toolkit)

`@arcanejs/react-toolkit` Allows you to quickly create real-time control panels
for your JavaScript / TypeScript single-server apps,
using a custom react renderer, and WebSockets.

Control panels can be accessed by any number of
browsers / devices / clients simultaneously,
and changes caused by any client will be immediately propagated to all other
clients.

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

## Usage

Install the following packages:

```
npm install --save react@^18 @arcanejs/toolkit @arcanejs/react-toolkit
```

Note:

- We explicitly require `react` version 18
- We don't need `react-dom` or any react native libraries,
  `@arcanejs/react-toolkit` is the react renderer.

Then you can then create control panels using react to manage the
server-side state like this:

```ts
import { useState } from 'react';
import { Toolkit } from '@arcanejs/toolkit';
import { ToolkitRenderer, Group, Switch, SliderButton } from '@arcanejs/react-toolkit';

const toolkit = new Toolkit();

// Expose the toolkit control panel on HTTP port 3000
// Navigate to http://localhost:3000 to access the control panel
// this will be printed in your console
toolkit.start({
  mode: 'automatic',
  port: 3000,
});

const ControlPanel = () => {
  const [switchState, setSwitchState] = useState<'off' | 'on'>('off');
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <Group direction='vertical'>
      <Group>
        {`Switch State: ${switchState}`}
        <Switch
            state={switchState}
            onChange={setSwitchState}
          />
      </Group>
      <Group>
        {`Slider Value: ${sliderValue}`}
        <SliderButton
          value={sliderValue}
          onChange={setSliderValue}
          min={0}
          max={100}
          />
      </Group>
    </Group>
  );
};

// Start rendering the control panel with @arcanejs/react-toolkit
ToolkitRenderer.render(<ControlPanel />, toolkit);
```

You would then be able to access the following control panel
from [localhost:3000](http://localhost:3000):

![Control Panel Screenshot](./docs/example-controller.png)

Please note:

- You can not use normal `react-dom` / HTML elements in these applications
  or components, only `@arcanejs` components are supported.

- You are welcome to abstract / componentize your application as you like,
  in the same manner that you would any `react-dom` or `react-native` project.

  _See the [counter example](https://github.com/arcanejs/arcanejs/blob/main/examples/react/src/counter.tsx)._

- This react / component-tree / state is managed server-side,
  and does not accurately represent the HTML used on the frontend.
  Your `@arcanejs` tree is converted to a JSON representation,
  and then sent to clients / browsers over a WebSocket.
  There is then a separate `react-dom` application
  that is loaded in the browser,
  and then used to render the JSON representation of the `@arcanejs` tree.

- There is currently no ability to introduce custom components with your
  own JSON definition and `react-dom` rendering in the browser.
  Apps can only be composed of the below supported components,
  or composite components directly built by these components.

  _(This is something that is planned for the future)._

## Components

For full example usage all of our components in applications that are
ready-to-run, we recommend that you check-out the
[examples directory](https://github.com/arcanejs/arcanejs/tree/main/examples/react).

### `Button`

TODO

### `Group`

TODO

### `Label`

TODO

### `Rect`

TODO

### `SliderButton`

TODO

### `Switch`

TODO

### `Tabs`

TODO

### `TextInput`

TODO

### `Timeline`

TODO

## [Examples](https://github.com/arcanejs/arcanejs/tree/main/examples/react)

For a comprehensive list of examples,
please see the example directory in the arcane monorepo:
<https://github.com/arcanejs/arcanejs/tree/main/examples/react>
