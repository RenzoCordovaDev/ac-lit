// Shell del catálogo: lista los componentes (desde catalog.json, generado en
// cada build por scripts/build-catalog.mjs) y muestra la demo real del
// seleccionado en un <iframe> -- nada de esto reimplementa ninguna demo.
// Ruteo por hash (#<id>) para que un link directo a un componente funcione
// en un host estático sin rewrites (GitHub Pages).

const listEl = document.getElementById('catalog-list');
const frameEl = document.getElementById('catalog-frame');
const emptyStateEl = document.getElementById('catalog-empty');
const searchInput = document.querySelector('.catalog__search-input');

let components = [];
let activeId = null;

function normalizeHash() {
  return decodeURIComponent(location.hash.replace(/^#/, ''));
}

function selectComponent(id, { updateHash = true } = {}) {
  const component = components.find(c => c.id === id) ?? components[0];
  if (!component) return;

  activeId = component.id;
  frameEl.src = component.demoEntry;
  frameEl.hidden = false;
  emptyStateEl.hidden = true;

  for (const button of listEl.querySelectorAll('.catalog__item-button')) {
    button.setAttribute('aria-current', String(button.dataset.id === activeId));
  }

  if (updateHash && normalizeHash() !== activeId) {
    history.replaceState(null, '', `#${activeId}`);
  }
}

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
      <span class="catalog__item-name">${component.id}</span>
      <span class="catalog__item-description">${component.description || component.pkgName}</span>
    `;
    button.addEventListener('click', () => selectComponent(component.id));
    li.append(button);
    listEl.append(li);
  }
}

async function init() {
  const response = await fetch('./catalog.json');
  const data = await response.json();
  components = data.components;

  renderList();

  const fromHash = normalizeHash();
  const initialId = components.some(c => c.id === fromHash) ? fromHash : components[0]?.id;
  if (initialId) {
    selectComponent(initialId, { updateHash: false });
    renderList(searchInput.value);
  } else {
    emptyStateEl.textContent = 'No hay componentes en el catálogo todavía.';
  }
}

window.addEventListener('hashchange', () => {
  const id = normalizeHash();
  if (id && id !== activeId) {
    selectComponent(id, { updateHash: false });
    renderList(searchInput.value);
  }
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
  emptyStateEl.textContent = 'No se pudo cargar el catálogo. Revisá la consola.';
});
