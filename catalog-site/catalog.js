// Shell del catálogo: lista los componentes (desde catalog.json, generado en
// cada build por scripts/build-catalog.mjs) agrupados en la sidebar, y muestra
// la demo real del seleccionado en un <iframe> -- nada de esto reimplementa
// ninguna demo. La demo corre en modo embebido (`embedded` de
// @ac-base/ac-demo-content): oculta su propia cabecera y toolbar, y los
// controles de acá la manejan por su API pública (mismo origen, sin
// postMessage). Ruteo por hash (#<id>) para que un link directo a un
// componente funcione en un host estático sin rewrites (GitHub Pages). Hash
// vacío = Home.

import { GROUPS, FALLBACK_GROUP_ID, FALLBACK_ICON, COMPONENT_META } from './catalog-meta.js';
import { COMPONENT_API } from './catalog-api.js';

const REPO_URL = 'https://github.com/RenzoCordovaDev/ac-lit';
const COPIED_FEEDBACK_MS = 1600;
const NARROW_SCREEN = window.matchMedia('(max-width: 900px)');

const DEVICE_ICONS = {
  mobile: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  tablet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>',
  desktop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
};
const SUN_ICON =
  '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
const MOON_ICON = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>';
const BELL_ICON =
  '<path d="M12 2a6 6 0 0 0-6 6v3.5c0 .9-.4 1.7-1 2.3L4 15h16l-1-1.2c-.6-.6-1-1.4-1-2.3V8a6 6 0 0 0-6-6Z"/><path d="M9 19a3 3 0 0 0 6 0"/>';
const CHEVRON_ICON = '<path d="M9 6l6 6-6 6"/>';

const homeViewEl = document.getElementById('view-home');
const catalogViewEl = document.getElementById('view-catalog');
const breadcrumbEl = document.getElementById('catalog-breadcrumb');
const countEl = document.getElementById('catalog-count');
const menuButton = document.getElementById('catalog-menu-button');
const backdropEl = document.getElementById('catalog-backdrop');
const themeToggle = document.getElementById('catalog-theme-toggle');

const groupsEl = document.getElementById('catalog-groups');
const searchInput = document.getElementById('catalog-search');

const heroIconEl = document.getElementById('catalog-hero-icon');
const heroNameEl = document.getElementById('catalog-hero-name');
const heroDescriptionEl = document.getElementById('catalog-hero-description');
const docsLinkEl = document.getElementById('catalog-docs-link');
const copyButton = document.getElementById('catalog-copy-npm');
const copyLabelEl = document.getElementById('catalog-copy-label');
const copyStatusEl = document.getElementById('catalog-copy-status');

const controlsEl = document.getElementById('catalog-controls');
const tabEls = [...document.querySelectorAll('.catalog__tab')];
const stageEl = document.getElementById('catalog-stage');
const frameEl = document.getElementById('catalog-frame');
const skeletonEl = document.getElementById('catalog-skeleton');
const skeletonFrameEl = document.getElementById('catalog-skeleton-frame');
const emptyStateEl = document.getElementById('catalog-empty');
const examplesEl = document.getElementById('catalog-examples');

const apiEl = document.getElementById('catalog-api');
const apiPropsContentEl = document.getElementById('catalog-api-props-content');
const apiEventsContentEl = document.getElementById('catalog-api-events-content');
const apiPropsCountEl = document.getElementById('catalog-api-props-count');
const apiEventsCountEl = document.getElementById('catalog-api-events-count');

const homeCategoriesEl = document.getElementById('catalog-home-categories');

const commandsDialog = document.getElementById('catalog-commands-dialog');

let components = [];
let activeId = null;
// El <ac-demo-content> de la demo cargada en el iframe (null mientras carga).
let demo = null;
let copiedTimer;
const expandedGroups = new Set([GROUPS[0].id]);
// Elecciones que se conservan al cambiar de componente.
const demoPrefs = { languageIndex: 0, theme: 'light', device: 'mobile' };

function icon(inner, size = 18) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

function create(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function metaFor(component) {
  const meta = COMPONENT_META[component.id] ?? {};
  const summary = meta.summary ?? (component.description || component.pkgName);
  return {
    icon: meta.icon ?? FALLBACK_ICON,
    summary,
    description: meta.description ?? summary,
  };
}

function groupFor(id) {
  return (
    GROUPS.find(group => group.members.includes(id)) ??
    GROUPS.find(group => group.id === FALLBACK_GROUP_ID)
  );
}

function memberOrder(group, id) {
  const index = group.members.indexOf(id);
  return index === -1 ? group.members.length : index;
}

function groupComponents(list) {
  return GROUPS.map(group => ({
    group,
    items: list
      .filter(component => groupFor(component.id) === group)
      .sort((a, b) => memberOrder(group, a.id) - memberOrder(group, b.id)),
  })).filter(entry => entry.items.length > 0);
}

function normalizeHash() {
  return decodeURIComponent(location.hash.replace(/^#/, ''));
}

/* Sidebar */

function setNavOpen(open) {
  document.body.dataset.navOpen = String(open);
  menuButton.setAttribute('aria-expanded', String(open));
  backdropEl.hidden = !open;
}

function renderNav() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = query
    ? components.filter(component =>
        [component.id, component.pkgName, component.description, metaFor(component).summary].some(
          text => text.toLowerCase().includes(query),
        ),
      )
    : components;

  groupsEl.replaceChildren();

  if (visible.length === 0) {
    groupsEl.append(
      create('p', 'catalog__list-empty', 'Ningún componente coincide con la búsqueda.'),
    );
    return;
  }

  for (const { group, items } of groupComponents(visible)) {
    // Con una búsqueda activa todos los grupos con resultados van abiertos.
    const expanded = Boolean(query) || expandedGroups.has(group.id);
    const listId = `catalog-group-${group.id}`;

    const section = create('section', 'catalog__group');
    const button = create('button', 'catalog__group-button');
    button.type = 'button';
    button.disabled = Boolean(query);
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-controls', listId);
    button.innerHTML = `<span class="catalog__group-icon">${icon(group.icon)}</span>`;
    button.append(
      create('span', 'catalog__group-label', group.label),
      create('span', 'catalog__group-count', String(items.length)),
    );
    button.insertAdjacentHTML(
      'beforeend',
      `<span class="catalog__group-chevron">${icon(CHEVRON_ICON, 14)}</span>`,
    );

    const list = create('ul', 'catalog__list');
    list.id = listId;
    list.hidden = !expanded;

    button.addEventListener('click', () => {
      const open = !expandedGroups.has(group.id);
      if (open) expandedGroups.add(group.id);
      else expandedGroups.delete(group.id);
      button.setAttribute('aria-expanded', String(open));
      list.hidden = !open;
    });

    for (const component of items) {
      const item = create('button', 'catalog__item-button');
      item.type = 'button';
      item.dataset.id = component.id;
      item.setAttribute('aria-current', String(component.id === activeId));
      item.innerHTML = `<span class="catalog__item-icon">${icon(metaFor(component).icon)}</span>`;
      const text = create('span', 'catalog__item-text');
      text.append(
        create('span', 'catalog__item-name', component.id),
        create('span', 'catalog__item-summary', metaFor(component).summary),
      );
      item.append(text);
      item.addEventListener('click', () => {
        showCatalog();
        selectComponent(component.id);
        setNavOpen(false);
      });
      const li = create('li');
      li.append(item);
      list.append(li);
    }

    section.append(button, list);
    groupsEl.append(section);
  }
}

function renderBreadcrumb(parts) {
  breadcrumbEl.replaceChildren(
    ...parts.map((part, index) => {
      const li = create('li', '', part);
      if (index === parts.length - 1) li.setAttribute('aria-current', 'page');
      return li;
    }),
  );
}

/* Vistas */

function showHome() {
  document.body.dataset.view = 'home';
  homeViewEl.hidden = false;
  catalogViewEl.hidden = true;
  activeId = null;
  demo = null;
  frameEl.removeAttribute('src');
  document.title = 'Catálogo de componentes — ac-lit';
  renderBreadcrumb(['Inicio']);
  for (const button of groupsEl.querySelectorAll('.catalog__item-button')) {
    button.setAttribute('aria-current', 'false');
  }
  if (location.hash !== '') {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function showCatalog() {
  document.body.dataset.view = 'catalog';
  homeViewEl.hidden = true;
  catalogViewEl.hidden = false;
}

function selectComponent(id, { updateHash = true } = {}) {
  const component = components.find(c => c.id === id) ?? components[0];
  if (!component) return;

  activeId = component.id;
  demo = null;

  const meta = metaFor(component);
  const group = groupFor(component.id);
  heroIconEl.innerHTML = icon(meta.icon, 40);
  heroNameEl.textContent = component.id;
  heroDescriptionEl.textContent = meta.description;
  docsLinkEl.href = `${REPO_URL}/blob/main/packages/components/${component.id}/README.md`;
  copyButton.dataset.command = `npm i ${component.pkgName}`;
  document.title = `${component.id} — Catálogo ac-lit`;
  renderBreadcrumb(['Componentes', group.label, component.id]);

  // Skeleton mientras carga el iframe nuevo -- evita el "de golpe" al
  // cambiar de componente. Se oculta directo en el evento `load` (ver más
  // abajo): la duración real queda atada a lo que tarde esa demo puntual en
  // cargar, sin ningún piso artificial por timeout.
  controlsEl.hidden = true;
  examplesEl.replaceChildren();
  renderApiInfo(component.id);
  setTab('demo');
  // El marco del skeleton usa el mismo preset elegido para la demo anterior
  // (persiste entre componentes, ver demoPrefs más abajo) -- así no cambia de
  // tamaño dos veces (skeleton -> otro tamaño -> real) si ya se había elegido
  // Tablet/Desktop.
  skeletonFrameEl.dataset.device = demoPrefs.device;
  skeletonEl.hidden = false;
  frameEl.hidden = true;
  emptyStateEl.hidden = true;
  frameEl.src = component.demoEntry;

  // Solo se redibuja la lista si hay que abrir el grupo del componente; si
  // ya está a la vista alcanza con mover la marca de "actual" (y así no se
  // pierde el foco del teclado).
  if (expandedGroups.has(group.id) || searchInput.value.trim()) {
    for (const button of groupsEl.querySelectorAll('.catalog__item-button')) {
      button.setAttribute('aria-current', String(button.dataset.id === activeId));
    }
  } else {
    expandedGroups.add(group.id);
    renderNav();
  }

  if (updateHash && normalizeHash() !== activeId) {
    history.replaceState(null, '', `#${activeId}`);
  }
}

/* Demo embebida: conexión con el <ac-demo-content> del iframe */

async function connectDemo() {
  const el = frameEl.contentDocument?.querySelector('ac-demo-content');
  if (!el) return null;

  await frameEl.contentWindow.customElements.whenDefined('ac-demo-content');
  el.embedded = true;
  if (el.demoState.darkMode) el.selectTheme(demoPrefs.theme);
  el.selectDevice(demoPrefs.device);
  el.selectLanguage(demoPrefs.languageIndex);
  await el.updateComplete;
  return el;
}

frameEl.addEventListener('load', async () => {
  const loadingId = activeId;
  if (!loadingId) return;

  const connected = await connectDemo();
  // Si mientras conectaba se eligió otro componente, esta carga ya no aplica.
  if (loadingId !== activeId) return;

  demo = connected;
  if (demo) {
    demo.addEventListener('ac-demo-content-state-change', event => {
      if (event.target === demo) syncDemoState(event.detail);
    });
    renderControls(demo.demoState);
    syncDemoState(demo.demoState);
  }

  skeletonEl.hidden = true;
  frameEl.hidden = false;
});

function segmented({ control, label, options, onSelect }) {
  const group = create('div', 'catalog__segmented');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', label);
  group.dataset.control = control;

  for (const option of options) {
    const button = create('button', 'catalog__segmented-button');
    button.type = 'button';
    button.dataset.value = String(option.value);
    button.setAttribute('aria-pressed', 'false');
    if (option.ariaLabel) button.setAttribute('aria-label', option.ariaLabel);
    if (option.icon) button.innerHTML = icon(option.icon, 16);
    if (option.label) button.append(create('span', '', option.label));
    button.addEventListener('click', () => onSelect(option.value));
    group.append(button);
  }
  return group;
}

function renderControls(state) {
  controlsEl.replaceChildren();

  if (state.languages.length === 2) {
    controlsEl.append(
      segmented({
        control: 'activeLanguage',
        label: 'Idioma',
        options: state.languages.map((locale, index) => ({
          value: index,
          label: locale.split('-')[0].toUpperCase(),
          ariaLabel: `Idioma: ${locale}`,
        })),
        onSelect: index => {
          demoPrefs.languageIndex = index;
          demo?.selectLanguage(index);
        },
      }),
    );
  }

  if (state.ambients.length > 0) {
    const field = create('label', 'catalog__field');
    const select = create('select', 'catalog__select');
    for (const ambient of state.ambients) {
      const option = create('option', '', ambient);
      option.value = ambient;
      select.append(option);
    }
    select.addEventListener('change', () => demo?.selectAmbient(select.value));
    field.append(create('span', '', 'Ambiente:'), select);
    controlsEl.append(field);
  }

  if (state.darkMode) {
    controlsEl.append(
      segmented({
        control: 'theme',
        label: 'Tema de la demo',
        options: [
          { value: 'light', icon: SUN_ICON, ariaLabel: 'Demo en modo claro' },
          { value: 'dark', icon: MOON_ICON, ariaLabel: 'Demo en modo oscuro' },
        ],
        onSelect: theme => {
          demoPrefs.theme = theme;
          demo?.selectTheme(theme);
        },
      }),
    );
  }

  controlsEl.append(
    segmented({
      control: 'device',
      label: 'Tamaño del dispositivo',
      options: state.devices.map(device => ({
        value: device.key,
        label: device.label,
        icon: DEVICE_ICONS[device.key],
      })),
      onSelect: key => {
        demoPrefs.device = key;
        skeletonFrameEl.dataset.device = key;
        demo?.selectDevice(key);
      },
    }),
  );

  if (state.eventNames.length > 0) {
    const button = create('button', 'catalog__events-button');
    button.type = 'button';
    button.innerHTML = icon(BELL_ICON, 16);
    button.append(
      create('span', '', 'Eventos'),
      create('span', 'catalog__events-count', String(state.eventCount)),
    );
    button.addEventListener('click', () => demo?.openEventsPanel());
    controlsEl.append(button);
  }

  controlsEl.hidden = false;
}

function syncDemoState(state) {
  for (const group of controlsEl.querySelectorAll('.catalog__segmented')) {
    const activeValue = String(state[group.dataset.control]);
    for (const button of group.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.value === activeValue));
    }
  }

  const eventsCountEl = controlsEl.querySelector('.catalog__events-count');
  if (eventsCountEl) eventsCountEl.textContent = String(state.eventCount);

  renderExamples(state);
}

const ARROW_ICON = '<path d="M5 12h14M13 6l6 6-6 6"/>';
const CHECK_ICON = '<path d="M5 12.5l4.5 4.5L15 7.5" stroke-width="2.5"/>';

function renderExamples(state) {
  examplesEl.replaceChildren(
    ...state.cases.map(caseInfo => {
      const active = caseInfo.index === state.activeCase;
      const button = create('button', 'catalog__example');
      button.type = 'button';
      button.setAttribute('aria-current', String(active));
      button.innerHTML = `<span class="catalog__example-badge">${caseInfo.index + 1}</span>`;
      const body = create('span', 'catalog__example-body');
      body.append(
        create('span', 'catalog__example-title', caseInfo.header),
        create('span', 'catalog__example-status', active ? 'En la demo ahora' : 'Ver en la demo'),
      );
      button.append(body);
      button.insertAdjacentHTML(
        'beforeend',
        `<span class="catalog__example-icon">${icon(active ? CHECK_ICON : ARROW_ICON, 16)}</span>`,
      );
      button.addEventListener('click', () => {
        demo?.selectCase(caseInfo.index);
        setTab('demo');
        document.getElementById('catalog-tab-demo').focus();
      });
      const li = create('li');
      li.append(button);
      return li;
    }),
  );
}

/* Propiedades/Eventos: dos expandibles debajo del stage, con la API pública
   del componente elegido (ver catalog-api.js, transcrita a mano de cada
   README). Solo se muestran en la pestaña Código (ver setTab() más abajo). */

function apiCell(text, { code = false } = {}) {
  const cell = create('td');
  if (!text) {
    cell.append(create('span', '', '—'));
    return cell;
  }
  if (code) {
    const codeEl = document.createElement('code');
    codeEl.textContent = text;
    cell.append(codeEl);
  } else {
    cell.textContent = text;
  }
  return cell;
}

function renderApiInfo(id) {
  const api = COMPONENT_API[id] ?? { properties: [], events: [] };
  const properties = api.properties ?? [];
  const events = api.events ?? [];

  apiPropsCountEl.textContent = String(properties.length);
  apiEventsCountEl.textContent = String(events.length);

  apiPropsContentEl.replaceChildren();
  if (properties.length === 0) {
    apiPropsContentEl.append(
      create(
        'p',
        'catalog__api-empty',
        'Este componente no expone propiedades públicas configurables.',
      ),
    );
  } else {
    const table = create('table', 'catalog__api-table');
    const headRow = create('tr');
    headRow.append(
      create('th', '', 'Propiedad'),
      create('th', '', 'Atributo'),
      create('th', '', 'Tipo'),
      create('th', '', 'Default'),
      create('th', '', 'Descripción'),
    );
    const thead = create('thead');
    thead.append(headRow);
    const tbody = create('tbody');
    for (const prop of properties) {
      const row = create('tr');
      row.append(
        apiCell(prop.name, { code: true }),
        apiCell(prop.attribute, { code: true }),
        apiCell(prop.type),
        apiCell(prop.default, { code: true }),
        apiCell(prop.description),
      );
      tbody.append(row);
    }
    table.append(thead, tbody);
    apiPropsContentEl.append(table);
  }

  apiEventsContentEl.replaceChildren();
  if (events.length === 0) {
    apiEventsContentEl.append(
      create('p', 'catalog__api-empty', 'Este componente no dispara eventos propios.'),
    );
  } else {
    const list = create('ul', 'catalog__api-events');
    for (const event of events) {
      const item = create('li');
      const nameEl = create('span', 'catalog__api-event-name', event.name);
      item.append(nameEl);
      if (event.detail) {
        item.append(create('span', 'catalog__api-event-detail', event.detail));
      }
      if (event.description) {
        item.append(create('span', 'catalog__api-event-description', event.description));
      }
      list.append(item);
    }
    apiEventsContentEl.append(list);
  }
}

/* Pestañas: Demo y Código son las dos vistas de la demo embebida; Ejemplos
   lista sus casos. */

function setTab(tab) {
  for (const tabEl of tabEls) {
    const selected = tabEl.dataset.tab === tab;
    tabEl.setAttribute('aria-selected', String(selected));
    tabEl.tabIndex = selected ? 0 : -1;
  }
  stageEl.dataset.tab = tab;
  stageEl.setAttribute('aria-labelledby', `catalog-tab-${tab}`);
  if (tab !== 'examples') demo?.selectViewMode(tab === 'code' ? 'code' : 'visual');
  apiEl.hidden = tab !== 'code';
}

for (const tabEl of tabEls) {
  tabEl.addEventListener('click', () => setTab(tabEl.dataset.tab));
  tabEl.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabEls[(tabEls.indexOf(tabEl) + step + tabEls.length) % tabEls.length];
    setTab(next.dataset.tab);
    next.focus();
  });
}

/* Cabecera del componente */

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.command);
  } catch {
    return;
  }
  copyLabelEl.textContent = 'Copiado';
  copyStatusEl.textContent = `Copiado al portapapeles: ${copyButton.dataset.command}`;
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    copyLabelEl.textContent = 'Copiar npm';
    copyStatusEl.textContent = '';
  }, COPIED_FEEDBACK_MS);
});

/* Tema: el botón de la barra superior cambia el tema del shell y arrastra al
   de la demo; el control "Tema de la demo" cambia solo la demo, para poder
   ver un componente en el otro tema sin cambiar toda la página. */

themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute(
    'aria-label',
    theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro',
  );
  demoPrefs.theme = theme;
  if (demo?.demoState.darkMode) demo.selectTheme(theme);
});

/* Comandos: atajo de la sidebar que abre un modal con los mismos comandos del
   CLI que ya se muestran en el Home -- para no tener que ir hasta ahí
   mientras se está mirando un componente. */

document.getElementById('catalog-sidebar-commands').addEventListener('click', () => {
  commandsDialog.showModal();
});
document.getElementById('catalog-commands-close').addEventListener('click', () => {
  commandsDialog.close();
});
commandsDialog.addEventListener('click', event => {
  // Ver comentario de .catalog__commands-body en catalog.css: el padding vive
  // en un wrapper interno, así que target === commandsDialog solo pasa al
  // clickear el backdrop real.
  if (event.target === commandsDialog) commandsDialog.close();
});

/* Home: categorías con el conteo real de componentes de cada grupo (mismos
   GROUPS que arma la sidebar) -- lleva directo al primer componente del
   grupo elegido. */

function renderHomeCategories() {
  const entries = groupComponents(components);
  homeCategoriesEl.replaceChildren(
    ...entries.map(({ group, items }) => {
      const pill = create(
        'button',
        'catalog__home-category-pill',
        `${group.label} (${items.length})`,
      );
      pill.type = 'button';
      pill.addEventListener('click', () => {
        showCatalog();
        selectComponent(items[0].id);
      });
      return pill;
    }),
  );
}

/* Navegación */

function goHome() {
  showHome();
  setNavOpen(false);
}

document.getElementById('catalog-home-link').addEventListener('click', goHome);
document.getElementById('catalog-sidebar-home').addEventListener('click', goHome);

document.getElementById('catalog-cta').addEventListener('click', () => {
  if (components.length === 0) return;
  showCatalog();
  selectComponent(groupComponents(components)[0].items[0].id);
});

menuButton.addEventListener('click', () => setNavOpen(document.body.dataset.navOpen !== 'true'));
backdropEl.addEventListener('click', () => setNavOpen(false));

searchInput.addEventListener('input', renderNav);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setNavOpen(false);
    return;
  }
  if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    if (NARROW_SCREEN.matches) setNavOpen(true);
    searchInput.focus();
    searchInput.select();
  }
});

window.addEventListener('hashchange', () => {
  const id = normalizeHash();
  if (!id) {
    showHome();
    return;
  }
  if (id !== activeId && components.some(c => c.id === id)) {
    showCatalog();
    selectComponent(id, { updateHash: false });
  }
});

async function init() {
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    document.getElementById('catalog-search-kbd').textContent = '⌘ K';
  }

  const response = await fetch('./catalog.json');
  const data = await response.json();
  components = data.components;
  countEl.textContent = String(components.length);
  renderHomeCategories();

  const fromHash = normalizeHash();
  if (fromHash && components.some(c => c.id === fromHash)) {
    expandedGroups.clear();
    showCatalog();
    selectComponent(fromHash, { updateHash: false });
  } else {
    showHome();
  }
  renderNav();
}

init().catch(error => {
  console.error('No se pudo cargar el catálogo:', error);
  showCatalog();
  emptyStateEl.hidden = false;
  emptyStateEl.textContent = 'No se pudo cargar el catálogo. Revisa la consola.';
});
