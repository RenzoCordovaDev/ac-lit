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

## Cambiar el locale desde fuera de un componente

Para un selector de idioma en la app/demo (sin depender de ninguna clase de componente):

```js
import { setGlobalLocale, getGlobalLocale } from '@ac-base/ac-intl-mixin';

localeSelect.addEventListener('change', () => setGlobalLocale(localeSelect.value));
```

> `IntlMixin.setGlobalLocale(...)` (accediendo la función del mixin directamente, sin extenderla) **no funciona** — es solo una factory, no una clase. Usa siempre la función standalone `setGlobalLocale` exportada del paquete, o el método estático sobre una clase real que extienda `IntlMixin` (p. ej. `MyComponent.setGlobalLocale(...)`).

## API

- **`loadTranslations(localesData)`** — carga el objeto `{ "es-PE": {...}, "en-EN": {...} }` de `locales.json`.
- **`t(key, params?)`** — traduce `key` para el locale actual, interpolando `{param}` en el texto.
- **`setLocale(locale)` / `getLocale()`** — cambia/lee el locale de esta instancia; `setLocale` propaga el cambio a **todas** las instancias montadas vía el evento global `ac-locale-changed`.
- **`getGlobalLocale()` / `setGlobalLocale(locale)`** — funciones standalone exportadas por el paquete; úsalas desde código que no es un componente.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-intl-mixin test
```
