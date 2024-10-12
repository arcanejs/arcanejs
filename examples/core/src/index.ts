import { Toolkit, Group } from '@arcanejs/toolkit';

const toolkit = new Toolkit();

toolkit.start({
  mode: 'automatic',
  port: 3000,
});

const root = new Group({
  title: 'Hello World',
});

toolkit.setRoot(root);

const groupA = root.appendChild(
  new Group({
    title: 'Group A',
  }),
);

const groupB = root.appendChild(
  new Group({
    title: 'Group B',
  }),
);

let s = 0;

setInterval(() => {
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
}, 500);
