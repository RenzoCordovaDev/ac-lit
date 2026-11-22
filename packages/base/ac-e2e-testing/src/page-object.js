/**
 * Page Object base para páginas (el demo de un componente, por ejemplo).
 * `browser`/`$`/`$$` son los globals que WebdriverIO inyecta en tiempo de
 * ejecución dentro del worker del testrunner — no se importan.
 */
export class PageObject {
  constructor({ path = '' } = {}) {
    this.path = path;
  }

  async open() {
    // Con WebDriver BiDi (protocolo de este proyecto, ver CHROME_CAPABILITIES
    // en config.js) no existe un "frame actual" global para cruzar hacia un
    // <iframe> — cada comando se manda al contexto explícito que corresponda.
    // `browser.url()` devuelve el browsing context de nivel superior; hay que
    // guardarlo, es la única forma de pedirle después su propio frame.
    this.context = await browser.url(this.path);
    return this;
  }

  /** El caso activo puede ser un documento completo cargado en `<iframe>` por
   * `ac-demo-case` (ver demo-case.js) en vez de un fragmento por `innerHTML`.
   * Si lo es, devuelve el browsing context de ESE documento (lo que hay que
   * usar para `$`/`execute` sobre lo que haya adentro, en vez del `$`/
   * `browser.execute` globales, que SIEMPRE apuntan al documento principal
   * con BiDi). Si es un fragmento, devuelve `null` — seguir usando los
   * globales de siempre. Sin memoizar a propósito: una prueba puede cambiar
   * de caso activo (`el usuario selecciona el caso "..."`), y cada caso tiene
   * su propio iframe. */
  async caseFrame() {
    // `ac-demo-case` carga su contenido una sola vez, la primera vez que se
    // activa (ver demo-case.js) — si la prueba ya visitó más de un caso,
    // puede haber más de un <iframe> en el DOM a la vez (uno por caso ya
    // activado alguna vez, todos menos el activo quedan `hidden`). El
    // selector de abajo se acota al caso ACTIVO ahora mismo, vía el atributo
    // reflejado `active` — nunca "cualquier" ac-demo-case con iframe.
    const selector = 'ac-demo-case[active] iframe';
    const hasIframe = await $(selector).isExisting();
    return hasIframe ? await this.context.frame(selector) : null;
  }
}

/** Component Object base: envuelve un selector raíz del componente bajo prueba.
 * `scope` es el browsing context a usar en vez del documento principal —
 * pasale el resultado de `pageObject.caseFrame()` cuando el componente viva
 * dentro del iframe de un caso "documento completo" (ver PageObject arriba);
 * dejalo sin pasar (o en `null`) para el camino de siempre (mismo documento). */
export class ComponentObject {
  constructor({ selector, scope = null }) {
    this.selector = selector;
    this.scope = scope;
  }

  get root() {
    return this.scope ? this.scope.$(this.selector) : $(this.selector);
  }

  /** `(this.scope ?? browser).execute(...)` para los métodos propios de una
   * subclase que necesiten `browser.execute()` crudo (no vía `this.root`). */
  get executor() {
    return this.scope ?? browser;
  }

  async waitForDisplayed(options) {
    await this.root.waitForDisplayed(options);
    return this;
  }

  async click() {
    await this.root.click();
  }
}

export const pageProvider = {
  async open(PageClass, ...args) {
    const page = new PageClass(...args);
    await page.open();
    return page;
  },
};

export const componentProvider = {
  find(ComponentClass, ...args) {
    return new ComponentClass(...args);
  },
};
