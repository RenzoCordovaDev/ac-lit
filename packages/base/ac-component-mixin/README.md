# @ac-base/ac-component-mixin

Mixin base que extienden **todos** los componentes del catálogo `@ac-components/*`. Integra `ScopedElementsMixin` e `IntlMixin` y agrega:

- Propiedades comunes: `ambient`, `mode`, `loading`, `loadingA11yLabel`, `mediaRangeConfig`.
- `sanitizeHtml(content, allowedTags?, tagNameCheck?)` — sanitización real con [DOMPurify](https://github.com/cure53/DOMPurify).
- `_skeletonTemplate` — plantilla de carga por defecto, mostrada mientras `loading` es `true`. Se estila con `componentBaseStyles` (ver abajo) — sin incluirlo en `static styles`, el skeleton se renderiza sin ningún CSS.
- Carga automática de `locales.json` (ver `@ac-base/ac-intl-mixin`): primero busca traducciones registradas en build time, si no existen intenta un `fetch` a rutas relativas comunes.

## Uso

```js
import { LitElement, html } from 'lit';
import { ComponentMixin, componentBaseStyles } from '@ac-base/ac-component-mixin';
import { MyComponentStyles } from './my-component.styles.js';

class MyComponent extends ComponentMixin(LitElement) {
  static get is() {
    return 'ac-my-component';
  }

  // componentBaseStyles primero: fija `font-family` en `:host` (tokens
  // "Emerald Pro", ver docs/CONVENTIONS.md) y estila el skeleton de arriba.
  // Todo componente nuevo lo incluye así, nunca solo sus propios estilos.
  static get styles() {
    return [componentBaseStyles, MyComponentStyles];
  }

  static get scopedElements() {
    return MyComponent.scopedElementsFromClasses([Icon, Badge]);
  }

  render() {
    if (this.loading) return this._skeletonTemplate;
    return html`<div>${this.t('greeting')}</div>`;
  }
}
customElements.define(MyComponent.is, MyComponent);
```

## `sanitizeHtml`

```js
this.sanitizeHtml('<p>hi</p><script>evil()</script>');
// -> '<p>hi</p>'

this.sanitizeHtml('<p>hi <b>bold</b></p>', ['p']); // solo permite <p>
// -> '<p>hi bold</p>'

this.sanitizeHtml('<p>hi</p><div>bye</div>', null, tag => tag !== 'div'); // predicado custom
// -> '<p>hi</p>'
```

## Desarrollo

```bash
pnpm --filter @ac-base/ac-component-mixin test
```
