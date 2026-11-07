# @ac-base/ac-core

Design tokens y utilidades DOM compartidas por todo el ecosistema **ac-lit**.

## Instalación

```bash
pnpm add @ac-base/ac-core
```

## Uso

```js
import { tokens } from '@ac-base/ac-core/tokens';
import {
  dispatchCustomEvent,
  debounce,
  throttle,
  generateId,
  isInViewport,
} from '@ac-base/ac-core/utils';

console.log(tokens.colors.primary);

dispatchCustomEvent(this, 'ac-button-click', { value: 42 });
```

También se puede importar la paleta de tokens CSS lista para usar:

```js
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

## API pública

- **`tokens`** — objeto JS con `colors`, `spacing`, `typography`, `borderRadius`, `shadows`, `breakpoints`.
- **`dispatchCustomEvent(element, eventName, detail?, options?)`** — despacha un `CustomEvent` con `bubbles: true, composed: true` por defecto (acorde a la convención de eventos `ac-*`).
- **`debounce(func, wait?)`**
- **`throttle(func, limit?)`**
- **`generateId(prefix?)`**
- **`isInViewport(element)`**

Este paquete no expone ningún Custom Element ni depende de Lit: es la base de utilidades que sí consumen `@ac-base/ac-component-mixin` y los componentes del catálogo.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-core test
```
