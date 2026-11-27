# @ac-components/ac-list-basic

Lista de contenido o acciones con texto, descripción e icono opcionales por fila.

## Instalación

```bash
pnpm add @ac-components/ac-list-basic
```

```js
import '@ac-components/ac-list-basic';
```

```html
<ac-list-basic
  selectable
  items='[
    {"id":"profile","text":"list-basic-profile","icon":"user","selected":true},
    {"id":"security","text":"list-basic-security","disabled":true}
  ]'
></ac-list-basic>
```

## Propiedades

| Propiedad    | Atributo     | Tipo                | Default     | Descripción                                                                                                                 |
| ------------ | ------------ | ------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`      | `items`      | Array o string JSON | `[]`        | Ítems en orden de presentación. Un arreglo con ítems válidos tiene prioridad sobre el contenido del slot.                   |
| `selectable` | `selectable` | Boolean             | `false`     | Renderiza un botón nativo por ítem de `items`. Los botones habilitados se enfocan con Tab y se activan con Enter o Espacio. |
| `ambient`    | `ambient`    | String              | `'surface'` | `surface` agrega fondo y elevación. `plain` usa un fondo transparente. Heredada de `@ac-base/ac-component-mixin`.           |

Cada ítem recibe `{ id, text, description?, icon?, disabled?, selected? }`. `id` es un string o número. `text` y `description` son strings y aceptan claves de traducción o texto literal. Los iconos iniciales son `user`, `check` e `info`. Omite `icon` o usa `none` para dejar la fila sin icono inicial.

`selected: true` muestra un fondo de selección y un indicador de confirmación. En un botón, el estado se expone con `aria-pressed`. `disabled: true` deshabilita el botón y lo excluye del orden de tabulación. Asigna un nuevo arreglo a `items` cuando cambies los datos o la selección.

## Eventos

| Evento                     | Cuándo                                 | `detail`                                                              |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------------- |
| `ac-list-basic-item-click` | Se activa un botón de fila habilitado. | `{ id, index }`, con el índice del ítem en `items` empezando en cero. |

El evento usa `bubbles: true` y `composed: true`. La aplicación puede escuchar la activación y actualizar `selected` en `items` según su propia lógica.

## Slots

| Slot      | Descripción                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| (default) | Elementos `<li>` propios cuando `items` está vacío o carece de ítems válidos. Cada `<li>` puede incluir enlaces o botones propios. |

```html
<ac-list-basic ambient="plain">
  <li>Documentación <a href="/ayuda">Abrir</a></li>
  <li>Historial de actividad</li>
</ac-list-basic>
```

## Theming

`surface` usa `--color-surface` y `--elev-1`. `plain` adopta el fondo de su contenedor. Las filas seleccionadas usan `--color-primary-700` y `--color-primary-50` en ambos temas. Los separadores usan `--color-subtext`.

```js
import '@ac-base/ac-core/tokens/base.css';
import '@ac-base/ac-core/tokens/modern-warm-palette.css';
import '@ac-base/ac-core/tokens/modern-warm-palette-light.css';
```

Activa el tema claro con `data-theme="light"` en `<html>`. Puedes personalizar la lista con `::part(list)`, `::part(item)`, `::part(button)`, `::part(text)`, `::part(description)`, `::part(icon)` y `::part(indicator)`.

## i18n

`locales.json` incluye traducciones para `es-PE`, `en-EN` y `pt-BR`. Usa claves como `list-basic-profile` y `list-basic-profile-description` en los ítems. El componente también traduce el anuncio de selección de las filas de solo lectura. El contenido del slot lo traduce quien lo proporciona.

## Desarrollo

```bash
pnpm --filter @ac-components/ac-list-basic component:lint
pnpm --filter @ac-components/ac-list-basic component:serve    # demo en http://localhost:5173
pnpm --filter @ac-components/ac-list-basic component:test
pnpm --filter @ac-components/ac-list-basic component:build
pnpm --filter @ac-components/ac-list-basic component:preview
```

> `src/list-basic.styles.js` se genera a partir de `src/list-basic.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve`, `component:build:styles:watch` recompila el SCSS al guardarlo.
