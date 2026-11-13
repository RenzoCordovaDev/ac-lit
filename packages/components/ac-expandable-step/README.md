# `@ac-components/ac-expandable-step`

Paso individual de un flujo multi-paso. Pensado para que lo orqueste un componente padre (ej. `ac-expandable-multistep`), que le asigna `stepNumber`/`totalSteps` y decide cuándo pasa de un estado a otro — `ac-expandable-step` no sabe nada del padre ni de otros steps, solo renderiza según sus propias properties. Tiene 3 estados mutuamente excluyentes: **pendiente** (no se muestra nada todavía), **activo** (expandido, mostrando su contenido real) y **completado** (colapsado en una barra con el título y un link "Modificar" para volver a editarlo).

## Instalación

```bash
pnpm add @ac-components/ac-expandable-step
```

```js
import '@ac-components/ac-expandable-step';
```

```html
<ac-expandable-step active step-number="2" total-steps="4" header="Datos de pago">
  <p>Formulario u otro contenido real del paso.</p>
</ac-expandable-step>

<ac-expandable-step completed header="Datos de envío">
  <span slot="summary">Av. Siempre Viva 742, Lima — entrega estándar</span>
</ac-expandable-step>

<script type="module">
  const step = document.querySelector('ac-expandable-step');

  step.addEventListener('ac-expandable-step-edit', () => {
    step.edit(); // o: step.active = true; step.completed = false;
  });
</script>
```

## Propiedades

| Propiedad    | Atributo      | Tipo    | Default     | Descripción                                                                                                                             |
| ------------ | ------------- | ------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `header`     | `header`      | String  | `''`        | Título del paso. Pasa por `this.t()` (acepta clave de `locales.json` o literal).                                                        |
| `active`     | `active`      | Boolean | `false`     | Expandido, mostrando el contenido real (`<slot>` por defecto). Reflejado como atributo.                                                 |
| `completed`  | `completed`   | Boolean | `false`     | Colapsado en la barra resumen. Reflejado como atributo.                                                                                 |
| `disabled`   | `disabled`    | Boolean | `false`     | Oculta el link "Modificar" de la barra colapsada. Reflejado como atributo.                                                              |
| `editLabel`  | `edit-label`  | String  | `''`        | Texto del link "Modificar". Vacío usa `this.t('expandable-step-edit-label')`; con valor, pasa igual por `this.t()` (clave o literal).   |
| `stepNumber` | `step-number` | Number  | `0`         | Número de paso, usado en el contador del estado activo. Lo asigna normalmente el padre multistep.                                       |
| `totalSteps` | `total-steps` | Number  | `0`         | Total de pasos, usado en el contador del estado activo. Lo asigna normalmente el padre multistep.                                       |
| `ambient`    | `ambient`     | String  | `'primary'` | Heredado de `ComponentMixin`. `primary` (fondo `--color-primary-700`) o `secondary` (fondo `--color-accent-700`) de la barra colapsada. |

`active` y `completed` son mutuamente excluyentes a nivel visual: si ambas son `true`, se prioriza `active`. Con las dos en `false` (pendiente) el componente no ocupa espacio ni pinta nada (`:host { display: none }`).

### Métodos públicos

| Método       | Qué hace                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `complete()` | `completed = true; active = false;`. Atajo para marcar el paso como completado y colapsarlo. Dispara `-complete`.                                                                                      |
| `edit()`     | `active = true; completed = false;`. Atajo simétrico para volver a mostrar el contenido. No dispara ningún evento — el click en "Modificar" es lo que informa intención; esto es la acción resultante. |

## Slots

| Slot        | Descripción                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| _(default)_ | Contenido real del paso, mostrado solo en estado `active`.                                                |
| `summary`   | Resumen de lo completado en el paso, mostrado solo en estado `completed` (debajo del título en la barra). |

## Eventos

Todos `bubbles` y `composed`.

| Evento                        | Cuándo                                                                                                                   | `detail` |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| `ac-expandable-step-edit`     | Click en el link "Modificar" (solo si `!disabled`). Solo informa intención — no cambia `active`/`completed` por sí solo. | `{}`     |
| `ac-expandable-step-complete` | La propiedad `completed` pasa a `true` (no se dispara por el estado inicial `completed` del HTML).                       | `{}`     |

## Accesibilidad

- Validado con axe-core en ambos temas (claro y oscuro).
- La barra colapsada usa fondo sólido (`ambient` primary/secondary) con texto fijo claro (`--color-primary-50`/blanco) — nunca tokens que cambian con el tema (`--color-muted`/`--color-bg`/`--color-surface`), para que el contraste no se rompa al cambiar de tema. El link "Modificar" reutiliza el mismo tono (ya valida ≥ 4.5:1 contra el fondo sólido) y se diferencia del título con subrayado.
- El estado activo usa `--color-surface`/`--color-text`, que sí cambian con el tema porque es la superficie normal del documento, no un fondo sólido con texto fijo.

## i18n

`locales.json` incluye `expandable-step-edit-label` y `expandable-step-counter` (`es-PE`, `en-EN`, `pt-BR`), usadas respectivamente para el link "Modificar" por defecto y el contador del estado activo (`this.t('expandable-step-counter', { current, total })`).

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-expandable-step component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/expandable-step.styles.js` se genera a partir de `src/expandable-step.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
