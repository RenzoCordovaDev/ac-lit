import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
import { createCCP } from '@ac-base/ac-ccp';
import { createRouter } from '@ac-base/ac-router';
import '@ac-components/ac-text-basic';
import '@ac-components/ac-link-basic';
import './pages/home-page.js';
import './pages/users-table-page.js';
import './pages/user-detail-page.js';
import './pages/selected-user-badge-page.js';

const ccp = createCCP();

const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
  { path: '/seleccionado', name: 'seleccionado' },
]);

const views = {
  home: document.querySelector('app-home-page'),
  usuarios: document.querySelector('app-users-table-page'),
  'usuario-detalle': document.querySelector('app-user-detail-page'),
  seleccionado: document.querySelector('app-selected-user-badge-page'),
};

for (const view of Object.values(views)) {
  view.ccp = ccp;
}

function applyRoute(route) {
  const name = route.matched ? route.name : 'home';
  for (const [key, view] of Object.entries(views)) {
    view.hidden = key !== name;
  }
  views[name].routeParams = route.params;
}

applyRoute(router.current);
router.subscribe(applyRoute);
