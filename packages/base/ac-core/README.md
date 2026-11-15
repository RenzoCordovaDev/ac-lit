# @ac-base/ac-core

Design tokens y utilidades DOM compartidas por todo el ecosistema **ac-lit**.

## Instalación

```bash
pnpm add @ac-base/ac-core
```

## Uso

```js
import {
  dispatchCustomEvent,
  debounce,
  throttle,
  generateId,
  isInViewport,
} from '@ac-base/ac-core/utils';

dispatchCustomEvent(this, 'ac-button-click', { value: 42 });
```

Los tokens de diseño ("Emerald Pro" — ver `docs/CONVENTIONS.md`) son CSS, no JS. Se importan tal cual:

```js
// Tokens de forma/tipografía/espaciado/elevación — siempre, sin importar la paleta de color activa.
import '@ac-base/ac-core/tokens/base.css';

// Paleta de color.
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
```

Para soportar modo oscuro/claro, importa además la variante clara de la paleta — se activa poniendo `data-theme="light"` en `<html>` (los componentes no necesitan cambiar nada: las custom properties CSS cruzan el shadow DOM por herencia):

```js
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

```js
document.documentElement.setAttribute('data-theme', 'light'); // o 'dark' para volver
```

## API pública

- **`tokens/base.css`** — radio de borde (`--radius-sm`/`--radius`/`--radius-full`), tipografía (`--font-family`, `--font-size-xs/sm/md/lg`, `--font-weight-medium/bold`, `--line-height`/`--line-height-tight`), espaciado (`--space-1` a `--space-6`, grilla de 4px) y elevación (`--elev-1`/`--elev-2`). Ver "Emerald Pro" en `docs/CONVENTIONS.md` para la regla de uso de cada uno.
- **`tokens/modern-warm-palette.css`** / **`-light.css`** — paleta de color (ver más abajo).
- **`dispatchCustomEvent(element, eventName, detail?, options?)`** — despacha un `CustomEvent` con `bubbles: true, composed: true` por defecto (acorde a la convención de eventos `ac-*`).
- **`debounce(func, wait?)`**
- **`throttle(func, limit?)`**
- **`generateId(prefix?)`**
- **`isInViewport(element)`**

Este paquete no expone ningún Custom Element ni depende de Lit: es la base de utilidades que sí consumen `@ac-base/ac-component-mixin` y los componentes del catálogo.

> **`--color-subtext` no cumple contraste WCAG AA como texto** sobre `--color-bg` (3.89:1, hace falta 4.5:1) — está pensado para bordes/elementos decorativos, no para texto de verdad. Para texto secundario legible, usa `--color-text`.

> **`--color-neutral`/`--color-success`/`--color-warning`/`--color-danger` son fijos entre light/dark-mode a propósito** (no se redefinen en `modern-warm-palette-light.css`). Un componente que usa estos tokens como fondo sólido con un color de texto fijo (ej. un badge de estado) debe verse igual sin importar el tema de la página — si en cambio usara `--color-muted`/`--color-bg`/`--color-surface` (que sí cambian entre temas) con un texto fijo, el contraste se rompería al activar `dark-mode`. Encontrado así: `ac-badge-basic` usaba `--color-muted` + texto blanco fijo para su variant `neutral`, y quedaba casi ilegible en modo claro.

## Desarrollo

```bash
pnpm --filter @ac-base/ac-core test
```
