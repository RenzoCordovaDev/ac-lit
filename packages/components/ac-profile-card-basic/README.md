# `@ac-components/ac-profile-card-basic`

Tarjeta de perfil de usuario — componente de **composición**: combina 4 piezas ya existentes del catálogo (`ac-avatar-basic`, `ac-text-basic`, `ac-badge-basic` y `ac-button-basic`) como un único componente, sin exponer su API interna (ver "Dependencias entre componentes del catálogo" en `docs/CONVENTIONS.md`).

## Instalación

```bash
pnpm add @ac-components/ac-profile-card-basic
```

```js
import '@ac-components/ac-profile-card-basic';
```

```html
<ac-profile-card-basic
  name="Ana Torres"
  status-text="Activo"
  status-ambient="success"
  action-text="Ver perfil"
></ac-profile-card-basic>
```

## Propiedades

| Propiedad       | Atributo         | Tipo   | Default     | Descripción                                                                                                                                                                                                               |
| --------------- | ---------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | `name`           | String | `''`        | Nombre de la persona. Pasa por `this.t()`, así que acepta tanto una clave de `locales.json` como un literal. Se muestra vía `ac-text-basic` y también como `name` de `ac-avatar-basic` (iniciales si no hay `avatarSrc`). |
| `avatarSrc`     | `avatar-src`     | String | `''`        | URL de la imagen de perfil, pasada a `ac-avatar-basic`. Sin ella (o si falla al cargar), se muestran las iniciales.                                                                                                       |
| `statusText`    | `status-text`    | String | `''`        | Texto del badge de estado. Sin `statusText` no se renderiza ningún badge.                                                                                                                                                 |
| `statusAmbient` | `status-ambient` | String | `'neutral'` | Ambient del badge (`neutral`/`success`/`warning`/`danger`, mismos valores que `ac-badge-basic`).                                                                                                                          |
| `actionText`    | `action-text`    | String | `''`        | Texto del botón de acción. Pasa por `this.t()`. Sin `actionText` no se renderiza ningún botón.                                                                                                                            |

## Eventos

| Evento                               | Cuándo se dispara                               | `detail` |
| ------------------------------------ | ----------------------------------------------- | -------- |
| `ac-profile-card-basic-action-click` | Click en el botón de acción (si está presente). | `true`   |

El click interno de `ac-button-basic` se detiene con `stopPropagation()` — la API pública es la del `ac-profile-card-basic`, no la de sus piezas.

## i18n

`locales.json` incluye la clave `profile-card-basic-view-profile` (`es-PE`, `en-EN`, `pt-BR`), usada en el demo como `action-text`:

```html
<ac-profile-card-basic
  name="Ana Torres"
  action-text="profile-card-basic-view-profile"
></ac-profile-card-basic>
```

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-profile-card-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/profile-card-basic.styles.js` se genera a partir de `src/profile-card-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
