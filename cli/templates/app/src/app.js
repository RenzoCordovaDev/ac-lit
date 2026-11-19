import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import { createCCP } from '@ac-base/ac-ccp';
import './pages/home-page.js';
import './pages/users-table-page.js';
import './pages/selected-user-badge-page.js';

const ccp = createCCP();

const views = {
  home: document.querySelector('app-home-page'),
  tabla: document.querySelector('app-users-table-page'),
  seleccion: document.querySelector('app-selected-user-badge-page'),
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
