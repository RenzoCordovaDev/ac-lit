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
    await browser.url(this.path);
    return this;
  }
}

/** Component Object base: envuelve un selector raíz del componente bajo prueba. */
export class ComponentObject {
  constructor({ selector }) {
    this.selector = selector;
  }

  get root() {
    return $(this.selector);
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
