import { configure } from '@storybook/react';

function loadStories() {
  require('../app/stories/index.js');
}

configure(loadStories, module);
