import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class TransitionContainerPage extends ComponentObject {
  constructor(testId, scope) {
    super({ selector: `[data-testid="${testId}"]`, scope });
  }

  /** Datos del <dialog> interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return this.executor.execute(selector => {
      const el = document.querySelector(selector);
      const dialog = el.shadowRoot.querySelector('dialog');
      return {
        open: dialog.open,
        title: dialog.querySelector('h2').textContent.trim(),
        hasBackIcon: Boolean(dialog.querySelector('[part="back"]')),
      };
    }, this.selector);
  }

  /** Espera a que el <dialog> esté abierto y sin animaciones en curso. El
   * contenedor entra deslizándose: un click a un ícono del header durante ese
   * movimiento puede caer fuera del botón (WebDriver calcula el punto antes
   * de despachar el click) y el test falla de forma intermitente. */
  async waitForSettled() {
    await browser.waitUntil(
      () =>
        this.executor.execute(selector => {
          const dialog = document.querySelector(selector).shadowRoot.querySelector('dialog');
          const running = dialog
            .getAnimations({ subtree: true })
            .some(animation => animation.playState === 'running');
          return dialog.open && !running;
        }, this.selector),
      { timeout: 4000, timeoutMsg: `El contenedor "${this.selector}" no terminó de abrirse` },
    );
  }

  /** Encadenar `$()` para atravesar shadow DOM (`root.$('[part=...]')`) no
   * funciona igual cuando `root` se resolvió sobre el browsing context de un
   * frame (confirmado probando) — así que con `scope` se espera/clickea a
   * mano con JS crudo, sin depender de que WebdriverIO envuelva como elemento
   * clickeable lo que devuelve un `execute()` corrido en el contexto de un
   * frame (no siempre lo hizo de forma confiable al probarlo). Sin `scope`
   * (documento principal) se deja el camino de siempre, ya probado. */
  async waitForPartDisplayed(part) {
    if (!this.scope) {
      await this.root.$(`[part="${part}"]`).waitForDisplayed();
      return;
    }
    await browser.waitUntil(
      () =>
        this.executor.execute(
          (selector, part) => {
            const el = document
              .querySelector(selector)
              ?.shadowRoot.querySelector(`[part="${part}"]`);
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          },
          this.selector,
          part,
        ),
      {
        timeout: 10000,
        timeoutMsg: `El elemento [part="${part}"] de "${this.selector}" no llegó a mostrarse`,
      },
    );
  }

  /** Clickear por JS crudo (`el.click()`) puede no disparar el `@click`
   * interno de un componente anidado (su listener real vive DENTRO de su
   * propio shadow root, no en el host) — un click real de WebDriver sí
   * "atraviesa" porque es un click de mouse de verdad en coordenadas de
   * pantalla. Por eso se resuelve por coordenadas acá, igual que ya hace el
   * paso "click fuera" de los step-definitions para el mismo problema de
   * fondo. Usar SIEMPRE este camino (no uno más simple con `el.click()` o
   * con el nodo devuelto por `execute()` envuelto por WebdriverIO) — se
   * probó que ESE camino simple funciona para algunos "part" pero no para
   * otros, de forma no confiable, al construir este mismo fix en
   * ac-modal-basic. */
  async clickPart(part) {
    if (!this.scope) {
      await this.root.$(`[part="${part}"]`).click();
      return;
    }
    // `getBoundingClientRect()` devuelve sus campos como getters del
    // prototipo, no propiedades propias — se pierden al serializar el valor
    // de vuelta a través de `execute()` (confirmado: x/y llegaban como
    // `undefined` → `NaN` → `null` en el payload real de WebDriver). Hay que
    // volcarlos a mano a un objeto plano antes de devolver.
    const rect = await this.executor.execute(
      (selector, part) => {
        const el = document.querySelector(selector)?.shadowRoot.querySelector(`[part="${part}"]`);
        if (!el) return null;
        el.scrollIntoView({ block: 'center', inline: 'center' });
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x, y, width, height };
      },
      this.selector,
      part,
    );
    if (!rect) throw new Error(`No se encontró [part="${part}"] en "${this.selector}"`);
    // El rect de arriba es relativo al documento del iframe — para clickear
    // en el punto real de la pantalla hay que sumarle dónde está el propio
    // iframe dentro de la página. El propio iframe (y el marco de
    // dispositivo que lo contiene) puede quedar más abajo de los 800px de
    // alto de la ventana real sin que el scroll INTERNO del iframe tenga
    // nada que ver — hay que desplazar la página de nivel superior también.
    const iframeRect = await browser.execute(() => {
      const el = document.querySelector('ac-demo-case[active] iframe');
      if (!el) return null;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const { x, y } = el.getBoundingClientRect();
      return { x, y };
    });
    const x = Math.round((iframeRect?.x ?? 0) + rect.x + rect.width / 2);
    const y = Math.round((iframeRect?.y ?? 0) + rect.y + rect.height / 2);
    await browser.action('pointer').move({ x, y, origin: 'viewport' }).down().up().perform();
  }

  async property(name) {
    return this.executor.execute(
      (selector, prop) => document.querySelector(selector)[prop],
      this.selector,
      name,
    );
  }
}
