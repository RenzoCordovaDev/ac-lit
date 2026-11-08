/**
 * ac-demo-case: contenedor de un caso de demo cargado desde un archivo HTML
 * externo (`href`). Deliberadamente NO usa Shadow DOM ni Lit: el HTML que
 * carga está pensado para comportarse como si fuera parte directa de la
 * página (participa del CSS global del demo, ej. `.row`/`.controls` de
 * demo-base.css), y evita el problema de tener que atravesar dos shadow
 * roots anidados (ac-demo-content -> ac-demo-case -> los componentes reales)
 * para que ac-demo-content pueda controlarlos (ej. cambiar su `ambient`).
 *
 * El contenido de `href` se asume de confianza — lo escribe quien desarrolla
 * el componente, igual que el propio demo/index.html. No se sanitiza.
 */
export class DemoCase extends HTMLElement {
  static get is() {
    return 'ac-demo-case';
  }

  static get observedAttributes() {
    return ['active'];
  }

  constructor() {
    super();
    this._loaded = false;
  }

  get header() {
    return this.getAttribute('header') ?? '';
  }

  get descripcion() {
    return this.getAttribute('descripcion') ?? '';
  }

  get href() {
    return this.getAttribute('href') ?? '';
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(value) {
    this.toggleAttribute('active', Boolean(value));
  }

  connectedCallback() {
    this.hidden = !this.active;
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name !== 'active') return;

    const isActive = newValue !== null;
    this.hidden = !isActive;

    if (isActive && !this._loaded) {
      this._loadContent();
    }
  }

  async _loadContent() {
    this._loaded = true;
    try {
      const response = await fetch(this.href);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      this.innerHTML = await response.text();
    } catch (error) {
      this.textContent = `Error cargando "${this.href}": ${error.message}`;
    }
  }
}
