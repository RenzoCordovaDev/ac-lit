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
import { LAB_LEVELS, LAB_REQUIREMENTS } from './learning-lab.js';

const REPO_URL = 'https://github.com/RenzoCordovaDev/ac-lit';
const API_GROUP_ID = 'apis';
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
const DOC_ICON =
  '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>';
const LIGHTBULB_ICON =
  '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>';

const homeViewEl = document.getElementById('view-home');
const catalogViewEl = document.getElementById('view-catalog');
const labViewEl = document.getElementById('view-lab');
const labSelectorEl = document.getElementById('lab-selector');
const labLevelEl = document.getElementById('lab-level');
const labRequirementsEl = document.getElementById('lab-requirements');
const labLevelGridEl = document.getElementById('lab-level-grid');
const labLevelTitleEl = document.getElementById('lab-level-title');
const labLevelIntroEl = document.getElementById('lab-level-intro');
const labNavListEl = document.getElementById('lab-nav-list');
const labContentEl = document.getElementById('lab-content');
const labNavSearchEl = document.getElementById('lab-nav-search');
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
const tabsEl = document.querySelector('.catalog__tabs');
const stageEl = document.getElementById('catalog-stage');
const frameEl = document.getElementById('catalog-frame');
const skeletonEl = document.getElementById('catalog-skeleton');
const skeletonFrameEl = document.getElementById('catalog-skeleton-frame');
const emptyStateEl = document.getElementById('catalog-empty');
const examplesEl = document.getElementById('catalog-examples');
const codeListEl = document.getElementById('catalog-code-list');

const apiEl = document.getElementById('catalog-api');
const apiPropsContentEl = document.getElementById('catalog-api-props-content');
const apiEventsContentEl = document.getElementById('catalog-api-events-content');
const apiMethodsContentEl = document.getElementById('catalog-api-methods-content');
const apiPropsCountEl = document.getElementById('catalog-api-props-count');
const apiEventsCountEl = document.getElementById('catalog-api-events-count');
const apiMethodsCountEl = document.getElementById('catalog-api-methods-count');

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
  labViewEl.hidden = true;
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
  labViewEl.hidden = true;
}

let activeLevel = null;
let selectedLabId = null;
// Último laboratorio que `renderLabContent()` efectivamente pintó -- permite
// distinguir "cambió el laboratorio mostrado" (sí reinicia el scroll) de "este
// mismo laboratorio se volvió a renderizar" (no lo toca).
let lastRenderedLabId = null;

// `levelId` ausente -- o desconocido -- muestra el selector de nivel; un
// `levelId` real muestra la página propia de ese nivel.
function showLab(levelId) {
  document.body.dataset.view = 'lab';
  homeViewEl.hidden = true;
  catalogViewEl.hidden = true;
  labViewEl.hidden = false;
  activeId = null;
  demo = null;
  frameEl.removeAttribute('src');

  const level = LAB_LEVELS.find(entry => entry.id === levelId);
  if (!level) {
    activeLevel = null;
    document.title = 'Laboratorio — ac-lit';
    renderBreadcrumb(['Laboratorio']);
    labSelectorEl.hidden = false;
    labLevelEl.hidden = true;
    renderLabSelector();
    return;
  }

  activeLevel = level;
  document.title = `Laboratorio — ${level.title} — ac-lit`;
  renderBreadcrumb(['Laboratorio', level.title]);
  labSelectorEl.hidden = true;
  labLevelEl.hidden = false;
  labLevelTitleEl.textContent = `Laboratorio — ${level.title}`;
  labLevelIntroEl.textContent = level.description;
  labProgress = loadLabProgress(level.id);
  openLabChapters.clear();
  labNavSearchEl.value = '';
  lastRenderedLabId = null;
  selectedLabId = autoSelectLabId(level);
  if (selectedLabId) {
    const found = findLab(level, selectedLabId);
    if (found) openLabChapters.add(found.chapter.id);
  } else if (level.chapters.length) {
    openLabChapters.add(level.chapters[0].id);
  }
  renderLabLevel(level);
}

function renderLabSelector() {
  labRequirementsEl.replaceChildren();
  const titleRow = create('div', 'catalog__lab-requirements-head');
  const titleIcon = create('span', 'catalog__lab-requirements-icon');
  titleIcon.innerHTML = icon(DOC_ICON, 20);
  titleRow.append(
    titleIcon,
    create('h2', 'catalog__lab-requirements-title', 'Requisitos de software'),
  );

  const equipoEl = create('p', 'catalog__lab-requirements-equipo', LAB_REQUIREMENTS.equipo);

  const terminal = create('div', 'catalog__terminal catalog__lab-requirements-terminal');
  terminal.setAttribute('role', 'group');
  terminal.setAttribute('aria-label', 'Comandos para confirmar tu versión instalada');
  const titlebar = create('div', 'catalog__terminal-titlebar');
  const dots = create('span', 'catalog__terminal-dots');
  dots.setAttribute('aria-hidden', 'true');
  dots.append(create('i'), create('i'), create('i'));
  titlebar.append(dots, create('span', 'catalog__terminal-filename', 'terminal — verificación'));
  const body = create('div', 'catalog__terminal-body');
  for (const { command, comment } of LAB_REQUIREMENTS.checks) {
    const lineWrap = create('div', 'catalog__terminal-command');
    const line = create('p', 'catalog__terminal-line');
    line.append(
      create('span', 'catalog__terminal-prompt', '$'),
      create('span', 'catalog__terminal-cmd', command),
    );
    const copyButton = create('button', 'catalog__terminal-copy');
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', 'Copiar comando');
    copyButton.innerHTML = icon(COPY_ICON, 13);
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(command);
      } catch {
        return;
      }
      const original = copyButton.innerHTML;
      copyButton.innerHTML = icon(CHECK_ICON, 13);
      clearTimeout(copyButton._copyTimer);
      copyButton._copyTimer = setTimeout(() => {
        copyButton.innerHTML = original;
      }, COPIED_FEEDBACK_MS);
    });
    lineWrap.append(line, copyButton);
    body.append(lineWrap);
    if (comment) {
      body.append(
        create('p', 'catalog__terminal-line catalog__terminal-line--comment', `# ${comment}`),
      );
    }
  }
  terminal.append(titlebar, body);

  labRequirementsEl.append(titleRow, equipoEl, terminal);

  labLevelGridEl.replaceChildren();
  for (const level of LAB_LEVELS) {
    const card = create('button', 'catalog__lab-level-card');
    card.type = 'button';

    const head = create('div', 'catalog__lab-level-card-head');
    const iconWrap = create('span', 'catalog__lab-level-card-icon');
    iconWrap.innerHTML = icon(level.icon, 22);
    const levelPill = create('span', 'catalog__lab-level-card-pill', level.levelLabel);
    head.append(iconWrap, levelPill);

    const featuresList = create('ul', 'catalog__lab-level-card-features');
    for (const feature of level.features) {
      const item = create('li', 'catalog__lab-level-card-feature');
      const featureIconWrap = create('span', 'catalog__lab-level-card-feature-icon');
      featureIconWrap.innerHTML = icon(feature.icon, 14);
      item.append(featureIconWrap, create('span', null, feature.text));
      featuresList.append(item);
    }

    const cta = create('span', 'catalog__lab-level-card-cta');
    const ctaIconWrap = create('span', 'catalog__lab-level-card-cta-icon');
    ctaIconWrap.innerHTML = icon(CHEVRON_ICON, 16);
    cta.append(create('span', null, level.ctaLabel), ctaIconWrap);

    card.append(
      head,
      create('span', 'catalog__lab-level-card-title', level.title),
      create('span', 'catalog__lab-level-card-description', level.description),
      create('hr', 'catalog__lab-level-card-divider'),
      featuresList,
      cta,
    );
    card.addEventListener('click', () => {
      history.replaceState(null, '', `#laboratorio/${level.id}`);
      showLab(level.id);
    });
    labLevelGridEl.append(card);
  }
}

/* Progreso del Laboratorio: ids de laboratorios completados, persistidos en
   localStorage (por navegador y por nivel; si no hay storage, simplemente no
   persiste). Cada nivel es una ruta independiente -- completar Básico no debe
   interferir con el progreso de Intermedio ni Avanzado. */

function progressKeyFor(levelId) {
  return `ac-lit:lab-progress:${levelId}`;
}

function loadLabProgress(levelId) {
  try {
    const raw = localStorage.getItem(progressKeyFor(levelId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLabProgress(levelId, completedSet) {
  try {
    localStorage.setItem(progressKeyFor(levelId), JSON.stringify([...completedSet]));
  } catch {
    // localStorage puede fallar (modo privado, cuota) -- el progreso simplemente no persiste esa vez.
  }
}

let labProgress = new Set();
// Capítulos abiertos en la vista de Laboratorio (sobrevive a los re-renders del nivel activo).
const openLabChapters = new Set();

let autoAdvanceTimer = null;

function clearAutoAdvanceTimer() {
  if (autoAdvanceTimer) {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

function toggleLabComplete(labId) {
  clearAutoAdvanceTimer();
  const allLabs = activeLevel.chapters.flatMap(chapter => chapter.labs);
  if (labProgress.has(labId)) {
    // Desmarcar un laboratorio re-bloquea los siguientes: se quitan del progreso
    // para que la ruta siga siendo estrictamente secuencial.
    const index = allLabs.findIndex(lab => lab.id === labId);
    for (const lab of allLabs.slice(index)) labProgress.delete(lab.id);
  } else {
    labProgress.add(labId);
  }
  saveLabProgress(activeLevel.id, labProgress);
  renderLabLevel(activeLevel);
}

function selectLab(labId) {
  clearAutoAdvanceTimer();
  selectedLabId = labId;
  const found = findLab(activeLevel, labId);
  if (found) openLabChapters.add(found.chapter.id);
  renderLabLevel(activeLevel);
}

// Solo la usa el botón "Marcar como completado" del panel de contenido (los
// checkboxes del nav siguen llamando a toggleLabComplete directo, sin esto) --
// al MARCAR (no al desmarcar) arranca una cuenta regresiva de 5s en el propio
// botón y, si hay un próximo laboratorio sin completar, navega solo ahí.
function handleCompleteButtonClick(lab) {
  const level = activeLevel;
  const wasDone = labProgress.has(lab.id);
  toggleLabComplete(lab.id);
  if (wasDone) return;

  const button = labContentEl.querySelector('.catalog__lab-content-complete-button');
  if (!button) return;

  const nextLabId = autoSelectLabId(level);
  // autoSelectLabId cae a un laboratorio ya completado cuando no queda nada
  // pendiente; en ese caso no hay "siguiente paso" que ofrecer.
  if (!nextLabId || nextLabId === lab.id || labProgress.has(nextLabId)) return;

  button.disabled = true;
  let secondsLeft = 5;
  button.textContent = `Siguiente paso en ${secondsLeft}s`;
  autoAdvanceTimer = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft > 0) {
      button.textContent = `Siguiente paso en ${secondsLeft}s`;
      return;
    }
    clearAutoAdvanceTimer();
    button.replaceChildren(create('span', 'catalog__lab-content-loader'));
    setTimeout(() => {
      if (selectedLabId === lab.id) selectLab(nextLabId);
    }, 600);
  }, 1000);
}

// Recorre los capítulos de un nivel aplicando la regla de desbloqueo
// estrictamente secuencial (un capítulo solo se abre si el anterior está
// 100% completo; dentro de un capítulo, un laboratorio solo si el anterior de
// ESE capítulo está completo) -- la comparten el nav, la auto-selección y la
// búsqueda de un laboratorio por id, en vez de recalcularla cada una por su cuenta.
function chapterEntries(level) {
  let previousChapterComplete = true;
  return level.chapters.map(chapter => {
    const doneCount = chapter.labs.filter(lab => labProgress.has(lab.id)).length;
    const chapterLocked = !previousChapterComplete;
    if (chapter.labs.length > 0) previousChapterComplete = doneCount === chapter.labs.length;
    const labs = chapter.labs.map((lab, index) => ({
      lab,
      locked: chapterLocked || (index > 0 && !labProgress.has(chapter.labs[index - 1].id)),
    }));
    return { chapter, doneCount, labs };
  });
}

function findLab(level, labId) {
  for (const entry of chapterEntries(level)) {
    const found = entry.labs.find(({ lab }) => lab.id === labId);
    if (found) return { chapter: entry.chapter, lab: found.lab, locked: found.locked };
  }
  return null;
}

// Primer laboratorio desbloqueado y sin completar (continuar donde quedó); si
// no hay ninguno (todo completo, o el nivel no tiene capítulos todavía), cae
// al último laboratorio desbloqueado, o null si no hay ninguno.
function autoSelectLabId(level) {
  let fallbackLastId = null;
  for (const entry of chapterEntries(level)) {
    for (const { lab, locked } of entry.labs) {
      if (!locked) fallbackLastId = lab.id;
      if (!locked && !labProgress.has(lab.id)) return lab.id;
    }
  }
  return fallbackLastId;
}

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

function renderLabLevel(level) {
  renderLabNav(level);
  renderLabContent(level);
  updateLabProgressBar(level);
}

function renderLabNav(level) {
  labNavListEl.replaceChildren();

  if (level.chapters.length === 0) {
    labNavListEl.append(
      create(
        'p',
        'catalog__lab-nav-empty',
        'Próximamente -- este nivel todavía no tiene capítulos publicados.',
      ),
    );
    return;
  }

  const query = labNavSearchEl.value.trim().toLowerCase();

  for (const entry of chapterEntries(level)) {
    const { chapter, doneCount, labs } = entry;
    const matchingLabs = query
      ? labs.filter(({ lab }) => lab.title.toLowerCase().includes(query))
      : labs;
    if (query && matchingLabs.length === 0) continue;

    const group = create('details', 'catalog__lab-nav-group');
    group.open = query ? true : openLabChapters.has(chapter.id);
    group.addEventListener('toggle', () => {
      if (group.open) openLabChapters.add(chapter.id);
      else openLabChapters.delete(chapter.id);
    });

    const summary = create('summary', 'catalog__lab-nav-group-summary');
    summary.append(create('span', 'catalog__lab-nav-group-title', chapter.title));
    if (chapter.labs.length > 0) {
      summary.append(
        create('span', 'catalog__lab-nav-group-count', `${doneCount}/${chapter.labs.length}`),
        create('span', 'catalog__lab-nav-group-time', formatMinutes(chapter.estimatedMinutes)),
      );
    }
    const chevronWrap = create('span', 'catalog__lab-nav-group-chevron');
    chevronWrap.innerHTML = icon(CHEVRON_ICON, 14);
    summary.append(chevronWrap);
    group.append(summary);

    const groupBody = create('div', 'catalog__lab-nav-group-body');
    if (labs.length === 0) {
      groupBody.append(create('p', 'catalog__lab-nav-empty', 'Próximamente.'));
    } else {
      for (const { lab, locked } of matchingLabs) {
        const row = create(
          'div',
          locked ? 'catalog__lab-nav-item catalog__lab-nav-item--locked' : 'catalog__lab-nav-item',
        );
        if (lab.id === selectedLabId) row.classList.add('catalog__lab-nav-item--active');

        const checkbox = create('input');
        checkbox.type = 'checkbox';
        checkbox.checked = labProgress.has(lab.id);
        checkbox.disabled = locked;
        checkbox.setAttribute('aria-label', `Marcar "${lab.title}" como completado`);
        checkbox.addEventListener('change', () => toggleLabComplete(lab.id));

        const button = create('button', 'catalog__lab-nav-item-button');
        button.type = 'button';
        button.disabled = locked;
        button.append(
          create('span', 'catalog__lab-nav-item-title', lab.title),
          create('span', 'catalog__lab-nav-item-time', formatMinutes(lab.estimatedMinutes)),
        );
        button.addEventListener('click', () => selectLab(lab.id));

        row.append(checkbox, button);
        groupBody.append(row);
      }
    }
    group.append(groupBody);
    labNavListEl.append(group);
  }

  if (query && labNavListEl.children.length === 0) {
    labNavListEl.append(
      create(
        'p',
        'catalog__lab-nav-empty',
        `Sin resultados para "${labNavSearchEl.value.trim()}".`,
      ),
    );
  }
}

/* Editor de código reutilizable -- fondo claro fijo (no depende del tema de
   la página), números de línea, resaltado por tipo de token. Pensado para
   usarse en cualquier parte del sitio que necesite mostrar código real (hoy:
   el contenido del Laboratorio), no solo en un lugar puntual.

   El tokenizador es deliberadamente simple (reglas con regex, no un parser
   real por lenguaje): alcanza para resaltar bien los fragmentos curados que
   escribimos nosotros mismos, no pretende tokenizar código arbitrario de
   cualquier usuario. */

function escapeHtml(text) {
  return text.replace(
    /[&<>"']/g,
    ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );
}

const JS_KEYWORDS =
  'const|let|var|function|class|extends|return|import|export|from|default|if|else|for|while|new|this|static|get|set|async|await|true|false|null|undefined|super|typeof|of|in|break|continue|try|catch|throw';

const CODE_TOKEN_RULES = {
  js: [
    { type: 'comment', re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { type: 'string', re: /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { type: 'tag', re: /<\/?[a-zA-Z][\w-]*/ },
    { type: 'number', re: /\b\d+(?:\.\d+)?\b/ },
    { type: 'keyword', re: new RegExp(`\\b(?:${JS_KEYWORDS})\\b`) },
    { type: 'function', re: /\b[a-zA-Z_$][\w$]*(?=\()/ },
  ],
  scss: [
    { type: 'comment', re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { type: 'string', re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { type: 'hex-color', re: /#[0-9a-fA-F]{3,8}\b/ },
    { type: 'variable', re: /\$[\w-]+|--[\w-]+/ },
    { type: 'number', re: /\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|%)?\b/ },
    { type: 'at-rule', re: /@[\w-]+/ },
    { type: 'selector', re: /[.:#&][\w-]+/ },
    { type: 'property', re: /\b[\w-]+(?=\s*:)/ },
    { type: 'function', re: /\b[a-zA-Z_-][\w-]*(?=\()/ },
  ],
  json: [
    { type: 'string-key', re: /"(?:\\.|[^"\\])*"(?=\s*:)/ },
    { type: 'string', re: /"(?:\\.|[^"\\])*"/ },
    { type: 'number', re: /\b\d+(?:\.\d+)?\b/ },
    { type: 'keyword', re: /\b(?:true|false|null)\b/ },
  ],
  bash: [
    { type: 'comment', re: /#[^\n]*/ },
    { type: 'string', re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { type: 'flag', re: /(?<=\s|^)--?[\w-]+/ },
  ],
  html: [
    { type: 'comment', re: /<!--[\s\S]*?-->/ },
    { type: 'tag', re: /<\/?[a-zA-Z][\w-]*/ },
    { type: 'string', re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { type: 'attr', re: /\b[a-zA-Z-]+(?==)/ },
  ],
};

function highlightCode(code, lang) {
  const rules = CODE_TOKEN_RULES[lang];
  if (!rules) return escapeHtml(code);

  const names = rules.map((rule, index) => ({ groupName: `t${index}`, type: rule.type }));
  const combined = new RegExp(
    rules.map((rule, index) => `(?<t${index}>${rule.re.source})`).join('|'),
    'g',
  );

  let result = '';
  let lastIndex = 0;
  for (const match of code.matchAll(combined)) {
    if (match.index > lastIndex) result += escapeHtml(code.slice(lastIndex, match.index));
    const found = names.find(({ groupName }) => match.groups[groupName] !== undefined);
    const text = match[0];
    if (found.type === 'hex-color') {
      result += `<span class="catalog__code-editor-swatch" style="background:${text}" aria-hidden="true"></span><span class="catalog__code-editor-token catalog__code-editor-token--hex-color">${escapeHtml(text)}</span>`;
    } else {
      result += `<span class="catalog__code-editor-token catalog__code-editor-token--${found.type}">${escapeHtml(text)}</span>`;
    }
    lastIndex = match.index + text.length;
  }
  if (lastIndex < code.length) result += escapeHtml(code.slice(lastIndex));
  return result;
}

function renderCodeEditor({ lang, filename, code }) {
  const wrapper = create('div', 'catalog__code-editor');
  if (filename || lang) {
    const head = create('div', 'catalog__code-editor-head');
    if (filename) head.append(create('span', 'catalog__code-editor-filename', filename));
    if (lang) head.append(create('span', 'catalog__code-editor-lang', lang));
    wrapper.append(head);
  }
  const body = create('div', 'catalog__code-editor-body');
  const lines = code.replace(/\n$/, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = create('span', 'catalog__code-editor-line-number', String(i + 1));
    const lineCode = create('span', 'catalog__code-editor-line-code');
    lineCode.innerHTML = highlightCode(lines[i], lang) || '&nbsp;';
    body.append(lineNumber, lineCode);
  }
  wrapper.append(body);
  return wrapper;
}

const IMAGE_ICON =
  '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>';
const EXTERNAL_LINK_ICON = '<path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v7H3V3h7"/>';

// Hueco visual para una imagen que todavía no existe (se suma después a
// mano) -- un cuadro con borde punteado y una nota de qué va a ir ahí, en vez
// de dejar el hueco totalmente mudo.
function buildImagePlaceholder(block) {
  const box = create('div', 'catalog__lab-content-image-placeholder');
  const iconWrap = create('span', 'catalog__lab-content-image-placeholder-icon');
  iconWrap.innerHTML = icon(IMAGE_ICON, 28);
  box.append(iconWrap, create('p', 'catalog__lab-content-image-placeholder-text', block.caption));
  return box;
}

// Lista de links externos curados (ej. la sección "Investigación") -- cada
// uno abre en una pestaña nueva, con una descripción corta opcional debajo.
function buildLinksList(block) {
  const wrap = create('div', 'catalog__lab-content-links');
  if (block.title) wrap.append(create('p', 'catalog__lab-content-links-title', block.title));
  const list = create('ul', 'catalog__lab-content-links-list');
  for (const item of block.items) {
    const li = create('li', 'catalog__lab-content-links-item');
    const link = create('a', 'catalog__lab-content-link', item.label);
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const iconWrap = create('span', 'catalog__lab-content-link-icon');
    iconWrap.innerHTML = icon(EXTERNAL_LINK_ICON, 14);
    link.append(iconWrap);
    li.append(link);
    if (item.description) {
      li.append(create('p', 'catalog__lab-content-link-description', item.description));
    }
    list.append(li);
  }
  wrap.append(list);
  return wrap;
}

function buildLabCallout(kind, title, text, iconPath) {
  const box = create('div', `catalog__lab-content-callout catalog__lab-content-callout--${kind}`);
  const iconWrap = create('span', 'catalog__lab-content-callout-icon');
  iconWrap.innerHTML = icon(iconPath, 18);
  const textWrap = create('div');
  textWrap.append(
    create('p', 'catalog__lab-content-callout-title', title),
    create('p', 'catalog__lab-content-callout-text', text),
  );
  box.append(iconWrap, textWrap);
  return box;
}

function renderLabContent(level) {
  labContentEl.replaceChildren();
  // El scroll se reinicia SOLO cuando el laboratorio mostrado cambió de
  // verdad (navegación manual o auto-avance) -- nunca cuando este mismo
  // laboratorio se vuelve a renderizar por otro motivo (ej. togglear su
  // propio checkbox), que no debe mover la posición de lectura del usuario.
  // replaceChildren() no resetea el scroll de un contenedor que sigue
  // montado, así que hace falta esta comparación explícita.
  if (selectedLabId !== lastRenderedLabId) {
    labContentEl.scrollTop = 0;
  }
  lastRenderedLabId = selectedLabId;

  const found = selectedLabId ? findLab(level, selectedLabId) : null;
  if (!found) {
    labContentEl.append(
      create(
        'p',
        'catalog__lab-content-empty',
        level.chapters.length === 0
          ? 'Próximamente -- este nivel todavía no tiene capítulos publicados.'
          : 'Selecciona un laboratorio de la lista para ver su contenido.',
      ),
    );
    return;
  }

  const { chapter, lab } = found;

  labContentEl.append(create('p', 'catalog__lab-content-breadcrumb', chapter.title));
  labContentEl.append(create('h2', 'catalog__lab-content-title', lab.title));
  labContentEl.append(
    create('span', 'catalog__lab-content-time', formatMinutes(lab.estimatedMinutes)),
  );
  labContentEl.append(create('p', 'catalog__lab-content-objective', lab.objective));

  for (const block of lab.content ?? []) {
    if (block.type === 'heading') {
      labContentEl.append(create('h3', 'catalog__lab-content-section-title', block.text));
    } else if (block.type === 'p') {
      labContentEl.append(create('p', 'catalog__lab-content-text', block.text));
    } else if (block.type === 'code') {
      labContentEl.append(renderCodeEditor(block));
    } else if (block.type === 'note') {
      labContentEl.append(buildLabCallout('hint', 'Nota', block.text, LIGHTBULB_ICON));
    } else if (block.type === 'image-placeholder') {
      labContentEl.append(buildImagePlaceholder(block));
    } else if (block.type === 'links') {
      labContentEl.append(buildLinksList(block));
    }
  }

  if (lab.checkpoint) {
    labContentEl.append(buildLabCallout('check', 'Checkpoint', lab.checkpoint, CHECK_ICON));
  }

  const actions = create('div', 'catalog__lab-content-actions');
  if (chapter.referenceDemo) {
    const link = create('a', 'catalog__lab-reference-link', 'Ver solución →');
    link.href = `./lab-reference-demos/${chapter.referenceDemo}/index.html`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    actions.append(link);
  }
  const isDone = labProgress.has(lab.id);
  const completeButton = create(
    'button',
    isDone
      ? 'catalog__lab-content-complete-button catalog__lab-content-complete-button--done'
      : 'catalog__lab-content-complete-button',
    isDone ? 'Completado ✓' : 'Marcar como completado',
  );
  completeButton.type = 'button';
  completeButton.addEventListener('click', () => handleCompleteButtonClick(lab));
  actions.append(completeButton);
  labContentEl.append(actions);
}

function updateLabProgressBar(level) {
  const totalLabs = level.chapters.reduce((sum, chapter) => sum + chapter.labs.length, 0);
  const doneLabs = level.chapters.reduce(
    (sum, chapter) => sum + chapter.labs.filter(lab => labProgress.has(lab.id)).length,
    0,
  );
  const percent = totalLabs === 0 ? 0 : Math.round((doneLabs / totalLabs) * 100);
  document.getElementById('lab-progress-fill').style.width = `${percent}%`;
  document.getElementById('lab-progress-label').textContent = `${percent}% completado`;
}

function selectComponent(id, { updateHash = true } = {}) {
  const component = components.find(c => c.id === id) ?? components[0];
  if (!component) return;

  activeId = component.id;
  demo = null;

  const meta = metaFor(component);
  const group = groupFor(component.id);
  const isApiComponent = group.id === API_GROUP_ID;
  heroIconEl.innerHTML = icon(meta.icon, 40);
  heroNameEl.textContent = component.id;
  heroDescriptionEl.textContent = meta.description;
  docsLinkEl.href = `${REPO_URL}/blob/main/packages/components/${component.id}/README.md`;
  copyButton.dataset.command = `npm i ${component.pkgName}`;
  document.title = `${component.id} — Catálogo ac-lit`;
  renderBreadcrumb(['Componentes', group.label, component.id]);

  controlsEl.hidden = true;
  examplesEl.replaceChildren();
  renderApiInfo(component.id);

  // La familia `ac-api-*` no renderiza nada y no tiene controles que
  // mostrar: en vez de un iframe/skeleton y las pestañas Demo/Código/
  // Ejemplos, va de frente a la ficha de Propiedades/Métodos/Eventos (ver
  // renderApiInfo arriba), que queda como único contenido siempre visible.
  tabsEl.hidden = isApiComponent;
  stageEl.hidden = isApiComponent;
  apiEl.hidden = !isApiComponent;

  if (isApiComponent) {
    frameEl.removeAttribute('src');
    frameEl.hidden = true;
    skeletonEl.hidden = true;
    emptyStateEl.hidden = true;
  } else {
    // Skeleton mientras carga el iframe nuevo -- evita el "de golpe" al
    // cambiar de componente. Se oculta directo en el evento `load` (ver más
    // abajo): la duración real queda atada a lo que tarde esa demo puntual en
    // cargar, sin ningún piso artificial por timeout.
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
  }

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

  // Si ya se había entrado a la pestaña Código antes de que el iframe
  // terminara de cargar, `renderCodeBlocks()` quedó esperando `demo` -- se
  // vuelve a pedir ahora que ya está disponible.
  if (stageEl.dataset.tab === 'code') renderCodeBlocks();
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

/* Propiedades/Métodos/Eventos: tres expandibles debajo del stage, con la API
   pública del componente elegido (ver catalog-api.js, transcrita a mano de
   cada README). Solo se muestran en la pestaña Código (ver setTab() más
   abajo). Métodos suele quedar vacío para los componentes visuales -- es la
   sección clave para la familia sin UI `ac-api-*` (ver docs/CONVENTIONS.md),
   donde no hay controles que mostrar en la demo y esta ficha es la
   documentación real del componente. */

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
  const api = COMPONENT_API[id] ?? {};
  const properties = api.properties ?? [];
  const events = api.events ?? [];
  const methods = api.methods ?? [];

  apiPropsCountEl.textContent = String(properties.length);
  apiEventsCountEl.textContent = String(events.length);
  apiMethodsCountEl.textContent = String(methods.length);

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

  apiMethodsContentEl.replaceChildren();
  if (methods.length === 0) {
    apiMethodsContentEl.append(
      create('p', 'catalog__api-empty', 'Este componente no expone métodos públicos propios.'),
    );
  } else {
    const list = create('ul', 'catalog__api-methods');
    for (const method of methods) {
      const item = create('li');
      item.append(create('span', 'catalog__api-method-signature', method.signature ?? method.name));
      if (method.description) {
        item.append(create('span', 'catalog__api-method-description', method.description));
      }
      if (method.event) {
        const eventLine = create('span', 'catalog__api-method-event');
        eventLine.append(create('span', '', 'Dispara: '), create('code', '', method.event));
        item.append(eventLine);
      }
      list.append(item);
    }
    apiMethodsContentEl.append(list);
  }
}

/* Código: un bloque independiente por cada ac-demo-case del componente
   activo, con su propio botón de copiado -- en vez del único visor de
   código de ac-demo-content (que solo muestra el caso activo en la Demo).
   El fuente de cada caso se trae con fetch() directo al archivo `href` del
   <ac-demo-case> (mismo origen que el iframe, ya que todo el catálogo
   estático vive bajo la misma raíz) y se cachea por componente. */
const COPY_ICON =
  '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>';
const codeSourceCache = new Map();

function loadCodeSources(component) {
  if (!codeSourceCache.has(component.id)) {
    codeSourceCache.set(
      component.id,
      (async () => {
        if (!demo) return [];
        const cases = [...demo.querySelectorAll(':scope > ac-demo-case')];
        return Promise.all(
          cases.map(async (caseEl, index) => {
            const header = caseEl.getAttribute('header') || `Caso ${index + 1}`;
            const href = caseEl.getAttribute('href');
            if (!href) return { header, source: '' };
            try {
              const url = new URL(href, frameEl.src).href;
              const response = await frameEl.contentWindow.fetch(url);
              return { header, source: response.ok ? (await response.text()).trim() : '' };
            } catch {
              return { header, source: '' };
            }
          }),
        );
      })(),
    );
  }
  return codeSourceCache.get(component.id);
}

async function copyCode(source, button) {
  if (!source) return;
  try {
    await navigator.clipboard.writeText(source);
  } catch {
    return;
  }
  const label = button.querySelector('.catalog__code-copy-label');
  label.textContent = 'Copiado';
  clearTimeout(button._copyTimer);
  button._copyTimer = setTimeout(() => {
    label.textContent = 'Copiar';
  }, COPIED_FEEDBACK_MS);
}

async function renderCodeBlocks() {
  const component = components.find(c => c.id === activeId);
  if (!component) return;
  const requestedId = activeId;
  codeListEl.replaceChildren(create('p', 'catalog__code-empty', 'Cargando código…'));
  if (!demo) return; // se vuelve a pedir cuando el iframe termine de cargar (ver más abajo)

  const entries = await loadCodeSources(component);
  // Si mientras cargaba se cambió de componente o de pestaña, este resultado ya no aplica.
  if (requestedId !== activeId || stageEl.dataset.tab !== 'code') return;

  if (entries.length === 0) {
    codeListEl.replaceChildren(
      create('p', 'catalog__code-empty', 'No se encontró código fuente para este componente.'),
    );
    return;
  }

  codeListEl.replaceChildren(
    ...entries.map(entry => {
      const card = create('div', 'catalog__terminal catalog__code-card');
      const head = create('div', 'catalog__terminal-titlebar catalog__code-card-head');
      head.append(create('span', 'catalog__code-card-title', entry.header));
      const copyBtn = create('button', 'catalog__code-copy');
      copyBtn.type = 'button';
      copyBtn.innerHTML = `${icon(COPY_ICON, 14)}<span class="catalog__code-copy-label">Copiar</span>`;
      copyBtn.addEventListener('click', () => copyCode(entry.source, copyBtn));
      head.append(copyBtn);
      card.append(head);

      const pre = create('pre', 'catalog__terminal-body catalog__code-card-pre');
      pre.append(create('code', '', entry.source || '(sin contenido)'));
      card.append(pre);
      return card;
    }),
  );
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
  if (tab === 'demo') demo?.selectViewMode('visual');
  if (tab === 'code') renderCodeBlocks();
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

/* Cada comando del modal tiene su propio botón de copiado (antes era un
   único botón para todo el bloque de la terminal). */
for (const button of commandsDialog.querySelectorAll('.catalog__terminal-copy')) {
  button.innerHTML = icon(COPY_ICON, 13);
  button.addEventListener('click', async () => {
    const command = button.dataset.command;
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    const original = button.innerHTML;
    button.innerHTML = icon(CHECK_ICON, 13);
    clearTimeout(button._copyTimer);
    button._copyTimer = setTimeout(() => {
      button.innerHTML = original;
    }, COPIED_FEEDBACK_MS);
  });
}

/* Home: categorías con el conteo real de componentes de cada grupo (mismos
   GROUPS que arma la sidebar) -- lleva directo al primer componente del
   grupo elegido. */

/* Cada tarjeta es un link real (`<a href="#id-del-primer-componente">"),
   no un botón -- navega por hash como cualquier otro link del catálogo, y
   el listener de `hashchange` ya existente (`window.addEventListener(
   'hashchange', ...)`) hace el resto (showCatalog + selectComponent), sin
   necesitar un handler de click propio. */
function renderHomeCategories() {
  const entries = groupComponents(components);
  homeCategoriesEl.replaceChildren(
    ...entries
      .filter(({ items }) => items.length > 0)
      .map(({ group, items }) => {
        const tile = create('a', 'catalog__home-category-tile');
        tile.href = `#${items[0].id}`;
        tile.innerHTML = `
          <span class="catalog__home-category-icon" aria-hidden="true">${icon(group.icon, 28)}</span>
          <span class="catalog__home-category-copy">
            <span class="catalog__home-category-label">${group.label}</span>
            <span class="catalog__home-category-count">${items.length} componente${items.length === 1 ? '' : 's'}</span>
          </span>
          <span class="catalog__home-category-chevron" aria-hidden="true">${icon(CHEVRON_ICON, 16)}</span>
        `;
        return tile;
      }),
  );
}

/* Navegación */

function goHome() {
  showHome();
  setNavOpen(false);
  setHomeMenuOpen(false);
}

function goToLab() {
  history.replaceState(null, '', '#laboratorio');
  showLab();
  setHomeMenuOpen(false);
}

function goToComponents() {
  if (components.length === 0) return;
  showCatalog();
  selectComponent(groupComponents(components)[0].items[0].id);
  setHomeMenuOpen(false);
}

document.getElementById('catalog-home-link').addEventListener('click', goHome);
document.getElementById('catalog-topbar-home-link').addEventListener('click', goHome);
document.getElementById('catalog-home-nav-home').addEventListener('click', goHome);
document.getElementById('catalog-home-nav-home-mobile').addEventListener('click', goHome);
document.getElementById('catalog-home-nav-components').addEventListener('click', goToComponents);
document
  .getElementById('catalog-home-nav-components-mobile')
  .addEventListener('click', goToComponents);
document.getElementById('catalog-home-nav-lab').addEventListener('click', goToLab);
document.getElementById('catalog-home-nav-lab-mobile').addEventListener('click', goToLab);
document.getElementById('catalog-sidebar-home').addEventListener('click', goHome);
document.getElementById('catalog-sidebar-lab').addEventListener('click', () => {
  history.replaceState(null, '', '#laboratorio');
  showLab();
  setNavOpen(false);
});
document.getElementById('catalog-home-lab-link').addEventListener('click', goToLab);
document.getElementById('catalog-lab-selector-back').addEventListener('click', goHome);
document.getElementById('catalog-lab-levels-back').addEventListener('click', () => {
  history.replaceState(null, '', '#laboratorio');
  showLab();
});

labNavSearchEl.addEventListener('input', () => {
  if (activeLevel) renderLabNav(activeLevel);
});

document.getElementById('catalog-cta').addEventListener('click', goToComponents);

menuButton.addEventListener('click', () => setNavOpen(document.body.dataset.navOpen !== 'true'));

/* Menú móvil del Home: disclosure independiente del toggle de la sidebar
   (ese es de la vista Catálogo, este vive en la topbar del Home) -- ver
   especificación de header aprobada (fuera del repo, adjuntada por Renzo). */
const homeMenuToggle = document.getElementById('catalog-home-menu-toggle');
const homeMobileNav = document.getElementById('catalog-home-mobile-nav');

function setHomeMenuOpen(open) {
  homeMenuToggle.setAttribute('aria-expanded', String(open));
  homeMobileNav.hidden = !open;
}

homeMenuToggle.addEventListener('click', () => {
  setHomeMenuOpen(homeMenuToggle.getAttribute('aria-expanded') !== 'true');
});

homeMobileNav.addEventListener('click', event => {
  if (event.target.closest('a, button')) setHomeMenuOpen(false);
});

backdropEl.addEventListener('click', () => setNavOpen(false));

searchInput.addEventListener('input', renderNav);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setNavOpen(false);
    if (homeMenuToggle.getAttribute('aria-expanded') === 'true') {
      setHomeMenuOpen(false);
      homeMenuToggle.focus();
    }
    return;
  }
  if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    if (NARROW_SCREEN.matches) setNavOpen(true);
    searchInput.focus();
    searchInput.select();
  }
});

// `undefined` -- no es una ruta del laboratorio. `null` -- es `#laboratorio`
// a secas (selector de nivel). Un string -- el id del nivel pedido.
function labLevelFromHash(id) {
  if (id === 'laboratorio') return null;
  if (id.startsWith('laboratorio/')) return id.slice('laboratorio/'.length);
  return undefined;
}

window.addEventListener('hashchange', () => {
  const id = normalizeHash();
  if (!id) {
    showHome();
    return;
  }
  const labLevel = labLevelFromHash(id);
  if (labLevel !== undefined) {
    showLab(labLevel);
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
  const labLevel = labLevelFromHash(fromHash);
  if (labLevel !== undefined) {
    showLab(labLevel);
  } else if (fromHash && components.some(c => c.id === fromHash)) {
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
