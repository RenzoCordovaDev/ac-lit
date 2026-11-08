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

Para soportar modo oscuro/claro, importa además la variante clara — se activa poniendo `data-theme="light"` en `<html>` (los componentes no necesitan cambiar nada: las custom properties CSS cruzan el shadow DOM por herencia):

```js
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

```js
document.documentElement.setAttribute('data-theme', 'light'); // o 'dark' para volver
```

## API pública

- **`tokens`** — objeto JS con `colors`, `spacing`, `typography`, `borderRadius`, `shadows`, `breakpoints`.
- **`dispatchCustomEvent(element, eventName, detail?, options?)`** — despacha un `CustomEvent` con `bubbles: true, composed: true` por defecto (acorde a la convención de eventos `ac-*`).
- **`debounce(func, wait?)`**
- **`throttle(func, limit?)`**
- **`generateId(prefix?)`**
- **`isInViewport(element)`**

Este paquete no expone ningún Custom Element ni depende de Lit: es la base de utilidades que sí consumen `@ac-base/ac-component-mixin` y los componentes del catálogo.

> **`--color-subtext` no cumple contraste WCAG AA como texto** sobre `--color-bg` (3.89:1, hace falta 4.5:1) — está pensado para bordes/elementos decorativos, no para texto de verdad. Para texto secundario legible, usa `--color-text`.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-core test
```
