# `@ac-components/ac-tabs-basic`

Pestañas accesibles (patrón WAI-ARIA Tabs). Las pestañas se declaran en la propiedad `tabs` y el contenido de cada panel se pasa con un **slot con el mismo nombre que el `id`** de la pestaña. Navegación completa por teclado y lista con scroll horizontal cuando hay muchas.

## Instalación

```bash
pnpm add @ac-components/ac-tabs-basic
```

```js
import '@ac-components/ac-tabs-basic';
```

```html
<ac-tabs-basic
  a11y-label="Ajustes de la cuenta"
  tabs='[{"id":"general","label":"General"},{"id":"avanzado","label":"Avanzado","disabled":true},{"id":"acerca","label":"Acerca de"}]'
>
  <div slot="general">Ajustes generales.</div>
  <div slot="avanzado">Panel de una pestaña deshabilitada.</div>
  <div slot="acerca">Versión y licencias.</div>
</ac-tabs-basic>
```

## Propiedades

| Propiedad   | Atributo     | Tipo   | Default     | Descripción                                                                                                                        |
| ----------- | ------------ | ------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `tabs`      | `tabs`       | Array  | `[]`        | Lista de `{ id, label, disabled? }` o de strings (el string es `id` y texto). Como atributo, JSON. El `label` pasa por `this.t()`. |
| `selected`  | `selected`   | String | `''`        | `id` de la pestaña activa. Si no existe o está deshabilitada, se usa la primera habilitada. Reflejado como atributo.               |
| `a11yLabel` | `a11y-label` | String | `''`        | Nombre accesible de la lista de pestañas (recomendado, sobre todo si hay más de un grupo en la página).                            |
| `ambient`   | `ambient`    | String | `'primary'` | Color del indicador de la pestaña activa: `primary` o `secondary`. Heredado de `ComponentMixin`.                                   |

El método `focus()` lleva el foco a la pestaña activa.

## Slots

Un slot por pestaña, con el mismo nombre que su `id`: `<div slot="general">…</div>`. Solo el panel de la pestaña activa se muestra.

## Eventos

| Evento                 | Cuándo                                             | `detail`         |
| ---------------------- | -------------------------------------------------- | ---------------- |
| `ac-tabs-basic-change` | El **usuario** cambia de pestaña (click o teclado) | `{ id: string }` |

`bubbles` y `composed`. Como un `change` nativo, **no** se dispara cuando `selected` se asigna desde el código ni al volver a pulsar la pestaña ya activa.

## Teclado

| Tecla          | Acción                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `←` / `→`      | Pestaña anterior / siguiente (con vuelta), saltando las deshabilitadas.                            |
| `Home` / `End` | Primera / última pestaña habilitada.                                                               |
| `Tab`          | Entra a la pestaña activa y de ahí al panel (los demás tabs no son tabulables: _roving tabindex_). |

La activación es automática: al mover el foco con las flechas se selecciona la pestaña.

## Parts y CSS

| Part      | Descripción                           |
| --------- | ------------------------------------- |
| `root`    | Contenedor de todo el componente.     |
| `tablist` | La lista de pestañas.                 |
| `tab`     | Cada pestaña (`<button role="tab">`). |
| `panel`   | Cada panel (`role="tabpanel"`).       |

## Accesibilidad

- Roles `tablist`/`tab`/`tabpanel` con `aria-selected`, `aria-controls` y `aria-labelledby`; _roving tabindex_ y paneles enfocables.
- El color del indicador de la pestaña activa depende del tema (claro/oscuro) para cumplir contraste.
- Una pestaña deshabilitada no se puede seleccionar ni con ratón ni con teclado.

## i18n

`locales.json` incluye `tabs-basic-profile`, `tabs-basic-security` y `tabs-basic-billing` (`es-PE`, `en-EN`, `pt-BR`) como ejemplo para `label`.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-tabs-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/tabs-basic.styles.js` se genera a partir de `src/tabs-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
