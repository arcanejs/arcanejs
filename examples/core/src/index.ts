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

setInterval(() => {
  groupA.setTitle('Group A ' + Math.random());
  if (Math.random() > 0.5) {
    root.removeChild(groupB);
  } else {
    root.appendChild(groupB);
  }
}, 500);
