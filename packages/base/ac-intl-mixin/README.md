# @ac-base/ac-intl-mixin

Mixin de internacionalización para `LitElement`, basado en un archivo `locales.json` por componente y un locale global compartido entre instancias.

## Uso

```js
import { LitElement, html } from 'lit';
import { IntlMixin } from '@ac-base/ac-intl-mixin';
import locales from './locales.json';

class MyComponent extends IntlMixin(LitElement) {
  static get is() {
    return 'ac-my-component';
  }

  constructor() {
    super();
    this.loadTranslations(locales);
  }

  render() {
    return html`<button>${this.t('submit-text')}</button>`;
  }
}
customElements.define(MyComponent.is, MyComponent);
```

## API

- **`loadTranslations(localesData)`** — carga el objeto `{ "es-PE": {...}, "en-EN": {...} }` de `locales.json`.
- **`t(key, params?)`** — traduce `key` para el locale actual, interpolando `{param}` en el texto.
- **`setLocale(locale)` / `getLocale()`** — cambia/lee el locale de esta instancia; `setLocale` propaga el cambio a **todas** las instancias montadas vía el evento global `ac-locale-changed`.
- **`IntlMixin.getGlobalLocale()` / `IntlMixin.setGlobalLocale(locale)`** — acceso estático al locale global.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-intl-mixin test
```
