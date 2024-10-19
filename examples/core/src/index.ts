import {
  Toolkit,
  Group,
  Button,
  Label,
  Rect,
  SliderButton,
  Switch,
} from '@arcanejs/toolkit';

const toolkit = new Toolkit();

toolkit.start({
  mode: 'automatic',
  port: 3000,
});

const root = new Group({
  title: 'Hello World',
  editableTitle: true,
});

root.addListener('title-changed', root.setTitle);

toolkit.setRoot(root);

const button = root.addHeaderChild(
  new Button({
    text: 'Click me!',
    icon: 'play_arrow',
  }),
);

const slider = root.appendChild(
  new SliderButton({
    value: 0,
  }),
);

root.appendChild(new Label({ text: 'Groups:', bold: true }));

const groupA = root.appendChild(
  new Group({
    title: 'Group A',
  }),
);

const sliderValue = groupA.appendChild(new Label({ text: 'Slider Value: 0' }));

slider.addListener('change', (value) => {
  sliderValue.setText(`Slider Value: ${value}`);
});

const groupB = root.appendChild(
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
      root.removeChild(groupB);
      break;
    case 3:
      root.appendChild(groupB);
      break;
  }
  s = (s + 1) % 4;
};

button.addListener('click', update);

root.appendChild(new Rect({ color: 'rgba(255,0,0,0.5)' }));

const sw = root.appendChild(new Switch({ state: 'on' }));

const swLabel = root.appendChild(new Label({ text: 'Switch is ON' }));

sw.addListener('change', (state) => {
  swLabel.setText(`Switch is ${state.toUpperCase()}`);
});
