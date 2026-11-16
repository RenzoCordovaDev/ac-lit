// Shell del catálogo: lista los componentes (desde catalog.json, generado en
// cada build por scripts/build-catalog.mjs) y muestra la demo real del
// seleccionado en un <iframe> -- nada de esto reimplementa ninguna demo.
// Ruteo por hash (#<id>) para que un link directo a un componente funcione
// en un host estático sin rewrites (GitHub Pages). Hash vacío = Home.

const homeViewEl = document.getElementById('view-home');
const catalogViewEl = document.getElementById('view-catalog');
const pageTitleEl = document.getElementById('catalog-page-title');
const homeLinkEl = document.getElementById('catalog-home-link');
const ctaEl = document.getElementById('catalog-cta');

const listEl = document.getElementById('catalog-list');
const frameEl = document.getElementById('catalog-frame');
const skeletonEl = document.getElementById('catalog-skeleton');
const emptyStateEl = document.getElementById('catalog-empty');
const searchInput = document.querySelector('.catalog__search-input');

let components = [];
let activeId = null;

// Ícono simple por componente -- solo referencial, no busca ser un ícono
// "oficial" de cada uno. Fallback genérico (círculo) para cualquier
// componente nuevo que no esté todavía en este mapa.
const ICON_PATHS = {
  'ac-avatar-basic': '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/>',
  'ac-badge-basic':
    '<path d="M12 2l2.5 5 5.5.5-4 4 1 5.5L12 14.5 7 17l1-5.5-4-4L9.5 7z" stroke-linejoin="round"/>',
  'ac-button-basic': '<rect x="3" y="8" width="18" height="8" rx="4"/>',
  'ac-card-basic': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
  'ac-checkbox-basic': '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  'ac-expandable-basic':
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10l4 4 4-4"/>',
  'ac-expandable-multistep':
    '<circle cx="6" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><path d="M11 6h10M11 12h10M11 18h10"/>',
  'ac-expandable-step': '<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>',
  'ac-input-basic': '<rect x="3" y="9" width="18" height="6" rx="1"/><path d="M8 9v6"/>',
  'ac-link-basic':
    '<path d="M8 12L5.5 14.5a3 3 0 104.2 4.2L12 16"/><path d="M16 12l2.5-2.5a3 3 0 10-4.2-4.2L12 8"/><path d="M9.5 14.5l5-5"/>',
  'ac-modal-basic': '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/>',
  'ac-notification-basic':
    '<path d="M12 4a5 5 0 00-5 5v4l-2 3h14l-2-3V9a5 5 0 00-5-5z"/><path d="M10 19a2 2 0 004 0"/>',
  'ac-profile-card-basic':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5"/><path d="M14 10h5M14 14h5"/>',
  'ac-radio-basic': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  'ac-select-basic': '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M15 11l2 2 2-2"/>',
  'ac-slider-basic': '<path d="M4 12h16"/><circle cx="14" cy="12" r="3"/>',
  'ac-spinner-basic': '<path d="M12 3a9 9 0 110 18"/>',
  'ac-switch-basic':
    '<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="15" cy="12" r="3"/>',
  'ac-tabs-basic': '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 7l4-3h4l2 3"/>',
  'ac-text-basic': '<path d="M5 5h14M12 5v14"/>',
  'ac-textarea-basic':
    '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 9h10M7 13h7"/>',
  'ac-toast-basic': '<rect x="5" y="6" width="16" height="7" rx="2"/><path d="M5 17h10"/>',
  'ac-transition-container':
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 8l4 4-4 4"/>',
};

function iconFor(id) {
  const inner = ICON_PATHS[id] ?? '<circle cx="12" cy="12" r="9"/>';
  return `<svg class="catalog__item-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

function normalizeHash() {
  return decodeURIComponent(location.hash.replace(/^#/, ''));
}

function showHome() {
  homeViewEl.hidden = false;
  catalogViewEl.hidden = true;
  pageTitleEl.hidden = true;
  activeId = null;
  if (location.hash !== '') {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function showCatalog() {
  homeViewEl.hidden = true;
  catalogViewEl.hidden = false;
  pageTitleEl.hidden = false;
}

function selectComponent(id, { updateHash = true } = {}) {
  const component = components.find(c => c.id === id) ?? components[0];
  if (!component) return;

  activeId = component.id;

  // Skeleton mientras carga el iframe nuevo -- evita el "de golpe" al
  // cambiar de componente.
  skeletonEl.hidden = false;
  frameEl.hidden = true;
  emptyStateEl.hidden = true;
  frameEl.src = component.demoEntry;

  for (const button of listEl.querySelectorAll('.catalog__item-button')) {
    button.setAttribute('aria-current', String(button.dataset.id === activeId));
  }

  if (updateHash && normalizeHash() !== activeId) {
    history.replaceState(null, '', `#${activeId}`);
  }
}

frameEl.addEventListener('load', () => {
  skeletonEl.hidden = true;
  frameEl.hidden = false;
});

function renderList(filterText = '') {
  const query = filterText.trim().toLowerCase();
  const filtered = query
    ? components.filter(
        c =>
          c.id.toLowerCase().includes(query) ||
          c.pkgName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query),
      )
    : components;

  listEl.innerHTML = '';

  if (filtered.length === 0) {
    const li = document.createElement('li');
    li.className = 'catalog__list-empty';
    li.textContent = 'Ningún componente coincide con la búsqueda.';
    listEl.append(li);
    return;
  }

  for (const component of filtered) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'catalog__item-button';
    button.dataset.id = component.id;
    button.setAttribute('aria-current', String(component.id === activeId));
    button.innerHTML = `
      <span class="catalog__item-row">
        ${iconFor(component.id)}
        <span class="catalog__item-name">${component.id}</span>
      </span>
      <span class="catalog__item-description">${component.description || component.pkgName}</span>
    `;
    button.addEventListener('click', () => {
      showCatalog();
      selectComponent(component.id);
    });
    li.append(button);
    listEl.append(li);
  }
}

async function init() {
  const response = await fetch('./catalog.json');
  const data = await response.json();
  components = data.components;

  renderList();

  if (components.length === 0) {
    emptyStateEl.textContent = 'No hay componentes en el catálogo todavía.';
    showCatalog();
    return;
  }

  const fromHash = normalizeHash();
  if (fromHash && components.some(c => c.id === fromHash)) {
    showCatalog();
    selectComponent(fromHash, { updateHash: false });
    renderList(searchInput.value);
  } else {
    showHome();
  }
}

window.addEventListener('hashchange', () => {
  const id = normalizeHash();
  if (!id) {
    showHome();
    return;
  }
  if (id !== activeId && components.some(c => c.id === id)) {
    showCatalog();
    selectComponent(id, { updateHash: false });
    renderList(searchInput.value);
  }
});

homeLinkEl.addEventListener('click', () => {
  showHome();
});

ctaEl.addEventListener('click', () => {
  if (components.length === 0) return;
  showCatalog();
  selectComponent(components[0].id);
});

searchInput.addEventListener('input', () => {
  renderList(searchInput.value);
});

// Tema: mismo mecanismo que @ac-base/ac-demo-content (data-theme en <html>),
// pero acotado al chrome del propio shell -- cada demo embebida sigue
// manejando su propio toggle interno, independiente (ver el plan).
for (const button of document.querySelectorAll('.catalog__theme-switcher button')) {
  button.addEventListener('click', () => {
    const theme = button.dataset.themeValue;
    document.documentElement.setAttribute('data-theme', theme);
    for (const b of document.querySelectorAll('.catalog__theme-switcher button')) {
      b.setAttribute('aria-pressed', String(b === button));
    }
  });
}

init().catch(error => {
  console.error('No se pudo cargar el catálogo:', error);
  showCatalog();
  emptyStateEl.hidden = false;
  emptyStateEl.textContent = 'No se pudo cargar el catálogo. Revisa la consola.';
});
