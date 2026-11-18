import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import { createCCP } from '../index.js';
import './pages/home-page.js';
import './pages/publisher-page.js';
import './pages/subscriber-page.js';

const ccp = createCCP();

const views = {
  home: document.querySelector('ccp-example-home-page'),
  publisher: document.querySelector('ccp-example-publisher-page'),
  subscriber: document.querySelector('ccp-example-subscriber-page'),
};

for (const view of Object.values(views)) {
  view.ccp = ccp;
}

function normalizeHash() {
  return decodeURIComponent(location.hash.replace(/^#/, ''));
}

function showView(id) {
  const name = views[id] ? id : 'home';
  for (const [key, view] of Object.entries(views)) {
    view.hidden = key !== name;
  }
}

window.addEventListener('hashchange', () => showView(normalizeHash()));
showView(normalizeHash());
