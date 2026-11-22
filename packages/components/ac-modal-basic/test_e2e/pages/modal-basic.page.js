import { ComponentObject } from '@ac-base/ac-e2e-testing';

export class ModalBasicPage extends ComponentObject {
  constructor(testId, scope) {
    super({ selector: `[data-testid="${testId}"]`, scope });
  }

  /** Datos del <dialog>/panel interno, leídos en una sola llamada al navegador. */
  async snapshot() {
    return this.executor.execute(selector => {
      const el = document.querySelector(selector);
      const dialog = el.shadowRoot.querySelector('dialog');
      // Si el modal está "contenido", el `<dialog>` ocupa SIEMPRE el marco
      // simulado entero (sin tamaño propio) y es `.ac-modal-basic__panel`
      // quien tiene el tamaño por `size` — ver "Superposiciones" en
      // CONVENTIONS.md. Sin contener, panel y dialog miden igual (el panel ya
      // ocupa el 100% del dialog), así que medir el panel sirve para ambos
      // casos. El "viewport" de referencia se lee de las variables CSS que
      // calculó `_syncContainedRect()` (ya recortadas contra la ventana real,
      // que puede ser más baja que el dispositivo simulado) en vez del rect
      // real de `.ac-demo-content__viewport`: son esas variables, no el rect
      // sin recortar, las que el propio componente usó para dibujarse.
      const panel = el.shadowRoot.querySelector('.ac-modal-basic__panel');
      const rect = panel.getBoundingClientRect();
      const px = value => parseFloat(value) || 0;
      const style = el.contained ? getComputedStyle(el) : null;
      return {
        open: dialog.open,
        top: rect.top,
        height: rect.height,
        width: rect.width,
        viewportTop: style ? px(style.getPropertyValue('--ac-modal-basic-contained-top')) : 0,
        viewportHeight: style
          ? px(style.getPropertyValue('--ac-modal-basic-contained-height'))
          : window.innerHeight,
        viewportWidth: style
          ? px(style.getPropertyValue('--ac-modal-basic-contained-width'))
          : window.innerWidth,
        title: dialog.querySelector('h2').textContent.trim(),
      };
    }, this.selector);
  }

  /** Espera a que el <dialog> esté abierto y sin animaciones en curso. El
   * modal entra con una animación de 300ms: un click a un botón del panel
   * durante ese movimiento puede caer fuera de él (WebDriver calcula el punto
   * antes de despachar el click) y el test falla de forma intermitente. */
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
      { timeout: 4000, timeoutMsg: `El modal "${this.selector}" no terminó de abrirse` },
    );
  }

  /** Encadenar `$()` para atravesar shadow DOM (`root.$('[part=...]')`) no
   * funciona igual cuando `root` se resolvió sobre el browsing context de un
   * frame (confirmado probando: `waitForSettled()` de arriba, que atraviesa
   * el mismo shadow root a mano con JS crudo dentro de un solo `execute()`,
   * sí funciona) — así que con `scope` se espera/clickea a mano con JS
   * crudo, sin depender de que WebdriverIO envuelva como elemento clickeable
   * lo que devuelve un `execute()` corrido en el contexto de un frame (no
   * siempre lo hizo de forma confiable al probarlo). Sin `scope` (documento
   * principal) se deja el camino de siempre, ya probado, que sí anda. */
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

  /** Clickear por JS crudo (`el.click()`) en el HOST de un componente anidado
   * (ej. `ac-button-basic`/`ac-link-basic`) no dispara su `@click` interno —
   * ese listener está en un elemento DENTRO de su propio shadow root (ej. el
   * `<button>`/`<a>` real), no en el host (confirmado leyendo su `render()`).
   * Un click real de WebDriver sí "atraviesa" porque es un click de mouse de
   * verdad en coordenadas de pantalla, no una llamada a un método — por eso
   * se resuelve por coordenadas acá, igual que ya hace el paso "click fuera
   * del modal" de los step-definitions para el mismo problema de fondo. */
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
    // `scrollIntoView()` primero: un click por coordenadas no se desplaza
    // solo hasta el elemento como sí lo hace el comando `click()` nativo de
    // WebDriver sobre un elemento — si el botón quedó fuera del área visible
    // del propio `<dialog>` o del scroll interno del iframe, el click cae
    // literalmente afuera de la ventana real ("move target out of bounds").
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
    // iframe dentro de la página (browser.action('pointer') trabaja siempre
    // en coordenadas del viewport de nivel superior, nunca las del frame).
    // El propio iframe (y el marco de dispositivo que lo contiene) puede
    // quedar más abajo de los 800px de alto de la ventana real (ver
    // CHROME_CAPABILITIES) sin que el scroll INTERNO del iframe tenga nada
    // que ver — hay que desplazar la página de nivel superior también.
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
