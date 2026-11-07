# @ac-base/ac-scoped-elements-mixin

Mixin para `LitElement` que registra las dependencias (otros Custom Elements) de un componente sin provocar colisiones de nombre globales.

## Uso

```js
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@ac-base/ac-scoped-elements-mixin';
import { Icon } from '@ac-components/ac-icon';

class MyComponent extends ScopedElementsMixin(LitElement) {
  static get is() {
    return 'ac-my-component';
  }

  static get scopedElements() {
    return MyComponent.scopedElementsFromClasses([Icon]);
  }

  render() {
    return html`<ac-icon></ac-icon>`;
  }
}
customElements.define(MyComponent.is, MyComponent);
```

## API

- **`static scopedElements`** — override para declarar un mapa `{ tagName: ElementClass }`.
- **`static scopedElementsFromClasses(classes)`** — helper que construye ese mapa a partir de un array de clases que exponen `static get is()`.
- **`defineScopedElement(tagName, ElementClass)`** — registra el tag solo si no existe ya en el registro global de `customElements`.
- **`getScopedElement(tagName)`** — recupera la clase registrada para esta instancia.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-scoped-elements-mixin test
```
