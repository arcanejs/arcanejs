import {
  Toolkit,
  Group,
  Button,
  Label,
  Rect,
  SliderButton,
  Switch,
  Tabs,
} from '@arcanejs/toolkit';

const toolkit = new Toolkit();

toolkit.start({
  mode: 'automatic',
  port: 3000,
});

const root = new Group({
  noBorder: true,
  direction: 'vertical',
});

toolkit.setRoot(root);

const tabs = root.appendChild(new Tabs());

// Slider Button

const sliderButtonTab = tabs.addTab(
  'Slider Button',
  new Group({
    noBorder: true,
  }),
);

const slider = sliderButtonTab.appendChild(
  new SliderButton({
    value: 0,
  }),
);

const sliderValue = sliderButtonTab.appendChild(
  new Label({ text: 'Slider Value: 0' }),
);

// Groups

const groupGroup = tabs.addTab(
  'Groups',
  new Group({
    title: 'Hello World',
    editableTitle: true,
  }),
);

const groupButton = groupGroup.addHeaderChild(
  new Button({
    text: 'Click me!',
    icon: 'play_arrow',
  }),
);

groupGroup.addListener('title-changed', groupGroup.setTitle);

const groupA = groupGroup.appendChild(
  new Group({
    title: 'Group A',
  }),
);

slider.addListener('change', (value) => {
  sliderValue.setText(`Slider Value: ${value}`);
});

const groupB = groupGroup.appendChild(
  new Group({
    title: 'Group B',
  }),
);

let s = 0;

const update = () => {
  switch (s) {
    case 0:
    case 2:
      groupA.setTitle('Group A ' + Math.random());
      break;
    case 1:
      groupGroup.removeChild(groupB);
      break;
    case 3:
      groupGroup.appendChild(groupB);
      break;
  }
  s = (s + 1) % 4;
};

groupButton.addListener('click', update);

// Rect

const rectGroup = tabs.addTab(
  'Rect',
  new Group({
    noBorder: true,
  }),
);

rectGroup.appendChild(new Rect({ color: 'rgba(255,0,0,0.5)' }));

// Switch

const switchGroup = tabs.addTab(
  'Switch',
  new Group({
    noBorder: true,
  }),
);

const sw = switchGroup.appendChild(new Switch({ state: 'on' }));

const swLabel = switchGroup.appendChild(new Label({ text: 'Switch is ON' }));

sw.addListener('change', (state) => {
  swLabel.setText(`Switch is ${state.toUpperCase()}`);
});
