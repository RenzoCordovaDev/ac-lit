// Un documento completo (<!doctype html>/<html>) en `href` se carga en un
// <iframe> en vez de por innerHTML — ver el comentario largo más abajo, junto
// a `_isFullDocument`, sobre por qué existen los dos caminos.
const FULL_DOCUMENT_RE = /^\s*(<!doctype html|<html[\s>])/i;

/**
 * ac-demo-case: contenedor de un caso de demo cargado desde un archivo HTML
 * externo (`href`). Soporta dos formatos de archivo:
 *
 * 1. Fragmento (lo que había hasta ahora): un trozo de HTML suelto, sin
 *    `<html>` propio. Se inyecta con `innerHTML` directo en el documento de
 *    la página — participa del CSS global del demo (ej. `.row`/`.controls`
 *    de demo-base.css) y evita atravesar dos shadow roots anidados
 *    (ac-demo-content -> ac-demo-case -> los componentes reales) para que
 *    ac-demo-content pueda controlarlos (ej. cambiar su `ambient`). Límite
 *    conocido: un `<script>` insertado por `innerHTML` nunca se ejecuta, así
 *    que un caso así no puede traer su propia lógica — tiene que vivir en el
 *    `demo.js` compartido de todo el demo.
 * 2. Documento completo (`<!doctype html>...<html>...</html>`): se carga en
 *    un `<iframe>` con `src` apuntando a `href`, así SÍ puede traer su propio
 *    `<script type="module">` (lógica propia por caso, sin acumular todo en
 *    el `demo.js` compartido). Efecto colateral deseado: un `<dialog>` nativo
 *    (`showModal()`) abierto dentro de ese documento queda acotado al propio
 *    iframe (es un browsing context aparte, con su propia capa superior) —
 *    sin necesitar `contained`/`getBoundary` ni medir nada por JS, sin
 *    importar cuántos niveles de shadow DOM tenga el componente por dentro.
 *    Costo: el documento del iframe es un documento aparte, así que
 *    ac-demo-content necesita un puente explícito para alcanzarlo (tema
 *    claro/oscuro, panel de eventos — ver `_onCaseLoad`/`case-event-bridge.js`
 *    en demo-content.js). El archivo debe vivir fuera de `demo/public/` (no
 *    como asset estático) para que Vite resuelva sus imports `@ac-base/...`
 *    tanto en dev como en build — ver vite.config.js de cada componente.
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
    this._source = '';
    this._iframe = null;
  }

  /** HTML crudo cargado desde `href` — usado por el toggle Visual/Código. */
  get source() {
    return this._source;
  }

  /** El `<iframe>` del caso, si `href` apuntó a un documento completo (si no, `null`). */
  get iframe() {
    return this._iframe;
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
    this._syncDisplay();
  }

  /** Elemento indefinido sin shadow DOM: el CSS con scope del shadow root de
   * ac-demo-content (que lo proyecta por <slot>) nunca lo alcanza, ni
   * siquiera vía `::slotted()` para un descendiente como el iframe de abajo
   * — tiene que ser en línea. Pero un `display` en línea fijo le ganaría
   * SIEMPRE a la regla `[hidden] { display: none }` del navegador (una regla
   * de atributo pierde contra un estilo en línea) — así que el propio
   * `display` en línea tiene que reflejar `active`, no ser un valor fijo
   * (si no, el caso inactivo queda renderizado y apilado igual, duplicando
   * el alto real de `.ac-demo-content__viewport` — encontrado vía una
   * violación real de accesibilidad, `scrollable-region-focusable`, en el
   * caso con contenido largo). */
  _syncDisplay() {
    this.hidden = !this.active;
    this.style.display = this.active ? 'block' : 'none';
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name !== 'active') return;

    const isActive = newValue !== null;
    this._syncDisplay();

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
      this._source = await response.text();
      if (FULL_DOCUMENT_RE.test(this._source)) {
        this._loadAsIframe();
        return;
      }
      this.innerHTML = this._source;
    } catch (error) {
      this.textContent = `Error cargando "${this.href}": ${error.message}`;
      return;
    }
    // ac-demo-content escucha esto para aplicar `contained`/`getBoundary` a los
    // componentes recién insertados (ver "Superposiciones" en CONVENTIONS.md).
    this.dispatchEvent(new CustomEvent('ac-demo-case-load', { bubbles: true }));
  }

  /** Camino "documento completo" — ver el comentario largo de la clase. */
  _loadAsIframe() {
    this.style.height = '100%';
    const iframe = document.createElement('iframe');
    iframe.className = 'ac-demo-case__iframe';
    iframe.setAttribute('title', this.header || 'Caso de demo');
    // Mismo motivo que `this.style.display` en connectedCallback: en línea,
    // nunca con CSS con scope de shadow DOM.
    iframe.style.cssText = 'display:block;width:100%;height:100%;border:0;background:transparent;';
    // Sin `{ once: true }` a propósito: en dev, el HMR de Vite puede recargar
    // el documento del iframe (ej. al tocar un `.styles.scss`) sin que
    // ac-demo-case se entere — cada recarga real dispara `load` de nuevo, así
    // que re-disparamos `ac-demo-case-load` cada vez para que
    // ac-demo-content vuelva a sincronizar tema/eventos.
    iframe.addEventListener('load', () => {
      this._iframe = iframe;
      // ac-demo-content escucha esto para sincronizar tema y puentear el
      // panel de eventos a través del iframe — ver `_onCaseLoad` en
      // demo-content.js.
      this.dispatchEvent(new CustomEvent('ac-demo-case-load', { bubbles: true }));
    });
    this.replaceChildren(iframe);
    iframe.src = this.href;
  }
}
