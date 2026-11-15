# `@ac-components/ac-avatar-basic`

Representación de usuario: imagen con fallback a iniciales. Sin eventos, sin slots.

## Instalación

```bash
pnpm add @ac-components/ac-avatar-basic
```

```js
import '@ac-components/ac-avatar-basic';
```

```html
<ac-avatar-basic src="./ada.jpg" name="Ada Lovelace" size="md" ambient="primary"></ac-avatar-basic>
```

## Propiedades

| Propiedad | Atributo  | Tipo   | Default     | Descripción                                                                                                                                                                                                |
| --------- | --------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`     | `src`     | String | `''`        | URL de la imagen. Vacío, o si la imagen falla al cargar (`error`), muestra el fallback de iniciales.                                                                                                       |
| `name`    | `name`    | String | `''`        | Nombre de la persona. Se usa para el `alt` de la imagen, para calcular las iniciales del fallback y como su `aria-label`.                                                                                  |
| `size`    | `size`    | String | `'md'`      | **Lista blanca**: `'sm'`, `'md'` o `'lg'`. Cualquier otro valor cae a `'md'`.                                                                                                                              |
| `ambient` | `ambient` | String | `'primary'` | Heredado de `ComponentMixin`: `'primary'` o `'secondary'` — color de fondo del fallback de iniciales (fondo sólido + texto fijo, igual criterio que `ac-badge-basic`; no cambia entre temas claro/oscuro). |

Sin eventos, sin slots.

## Comportamiento

- Con `src` válido: se muestra la imagen (`<img>`), con `alt` igual a `name`.
- Sin `src`, o si la imagen falla al cargar: se muestra el fallback — un `role="img"` con `aria-label` igual a `name` (o al texto traducido por defecto si `name` está vacío) y las iniciales visibles marcadas `aria-hidden="true"` (el lector de pantalla anuncia el `aria-label`, no letra por letra).
- **Iniciales**: primera letra de la primera palabra + primera letra de la última palabra de `name`, en mayúsculas. Con una sola palabra, solo esa letra. Sin `name`, no hay iniciales visibles (el círculo queda vacío, pero el `aria-label` sigue presente).
- Si `src` cambia después de un error previo, el componente le da a la imagen nueva una oportunidad real de cargar (no queda "pegado" en el fallback).

## Desarrollo

```bash
aclit component:lint
aclit component:serve           # o: pnpm --filter @ac-components/ac-avatar-basic component:serve    — demo en http://localhost:5173
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/avatar-basic.styles.js` se genera a partir de `src/avatar-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
