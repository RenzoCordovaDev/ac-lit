import { createRouter } from '../index.js';
import './pages/home-page.js';
import './pages/users-list-page.js';
import './pages/user-detail-page.js';

const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/usuarios', name: 'usuarios' },
  { path: '/usuarios/:id', name: 'usuario-detalle' },
]);

const views = {
  home: document.querySelector('ac-router-example-home-page'),
  usuarios: document.querySelector('ac-router-example-users-list-page'),
  'usuario-detalle': document.querySelector('ac-router-example-user-detail-page'),
};

for (const view of Object.values(views)) {
  view.router = router;
}

function applyRoute(route) {
  const name = route.matched ? route.name : 'home';
  for (const [key, view] of Object.entries(views)) {
    view.hidden = key !== name;
  }
}

applyRoute(router.current);
router.subscribe(applyRoute);
