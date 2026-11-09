# `@ac-components/ac-expandable-basic`

Panel expandible (acordeón) accesible. La cabecera es un `<button>` con `aria-expanded`; el contenido es un `<slot>` para que le des la forma que quieras. Varios paneles con el mismo `group` se comportan como un acordeón: solo uno abierto a la vez.

## Instalación

```bash
pnpm add @ac-components/ac-expandable-basic
```

```js
import '@ac-components/ac-expandable-basic';
```

```html
<ac-expandable-basic header="Más detalles" open>
  <p>Cualquier HTML: texto, listas, imágenes u otros componentes.</p>
</ac-expandable-basic>

<!-- Cabecera con formato propio -->
<ac-expandable-basic>
  <span slot="header">Una cabecera con <strong>formato</strong></span>
  <p>Contenido…</p>
</ac-expandable-basic>

<!-- Acordeón: solo uno abierto a la vez -->
<ac-expandable-basic group="faq" header="Pregunta 1" open><p>Respuesta 1</p></ac-expandable-basic>
<ac-expandable-basic group="faq" header="Pregunta 2"><p>Respuesta 2</p></ac-expandable-basic>
```

## Propiedades

| Propiedad  | Atributo   | Tipo    | Default     | Descripción                                                                                                                   |
| ---------- | ---------- | ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `header`   | `header`   | String  | `''`        | Texto de la cabecera (pasa por `this.t()`: una clave de `locales.json` se traduce, cualquier otro texto se muestra tal cual). |
| `open`     | `open`     | Boolean | `false`     | Panel abierto (reflejado como atributo).                                                                                      |
| `group`    | `group`    | String  | `''`        | Clave de grupo: al abrirse un panel, se cierran los demás del mismo `group`.                                                  |
| `disabled` | `disabled` | Boolean | `false`     | Bloquea la cabecera: el usuario no puede abrir ni cerrar el panel.                                                            |
| `ambient`  | `ambient`  | String  | `'primary'` | Color de la franja de acento y del foco: `primary` o `secondary`. Heredado de `ComponentMixin`.                               |

Métodos: `show()` abre el panel y `hide()` lo cierra.

## Slots

| Slot        | Descripción                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| _(default)_ | Contenido del panel.                                                            |
| `header`    | Cabecera personalizada. Si se usa, reemplaza al texto de la propiedad `header`. |

## Eventos

| Evento                       | Cuándo                                                                           | `detail`            |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------------- |
| `ac-expandable-basic-toggle` | El panel se abre o se cierra (por el usuario, por `show()`/`hide()` o por grupo) | `{ open: boolean }` |

`bubbles` y `composed`. No se dispara por el estado inicial (`open` en el HTML).

## Parts y CSS

| Part      | Descripción                  |
| --------- | ---------------------------- |
| `root`    | Contenedor de todo el panel. |
| `header`  | El botón de la cabecera.     |
| `panel`   | La región que se expande.    |
| `content` | El contenedor del contenido. |

## Accesibilidad

- La cabecera es un `<button>` con `aria-expanded` y `aria-controls`; el panel es una `role="region"` con `aria-labelledby` apuntando a la cabecera.
- Cerrado, el panel está `inert` y con `visibility: hidden`: su contenido no recibe foco ni se lee con lectores de pantalla.
- La altura se anima con `grid-template-rows` (de `0fr` a `1fr`), sin necesidad de conocer la altura del contenido; la animación se desactiva con `prefers-reduced-motion`.
- El foco y la franja de acento dependen del tema (claro/oscuro) para cumplir contraste.

## Grupos (acordeón)

Un `<button>` o un `<details>` nativo no coordina estado entre instancias de componentes distintas. `ac-expandable-basic` usa un registro en memoria por `group` (el mismo patrón de `ac-radio-basic`, ver `docs/CONVENTIONS.md`). Un panel que se elimina del DOM sale del grupo.

## i18n

`locales.json` incluye `expandable-basic-details` y dos preguntas de ejemplo (`es-PE`, `en-EN`, `pt-BR`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-expandable-basic component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/expandable-basic.styles.js` se genera a partir de `src/expandable-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
