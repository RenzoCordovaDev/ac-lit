# `@ac-components/ac-expandable-multistep`

Contenedor que orquesta una secuencia de [`ac-expandable-step`](../ac-expandable-step/README.md). Cada `ac-expandable-step` es "tonto" — no sabe nada del padre ni de otros steps, solo expone sus propias properties y eventos. **Toda la coordinación** (quién está activo, numeración, qué pasa al completar o editar un paso) vive en `ac-expandable-multistep`.

## Instalación

```bash
pnpm add @ac-components/ac-expandable-multistep
```

```js
import '@ac-components/ac-expandable-multistep';
```

```html
<ac-expandable-multistep>
  <ac-expandable-step header="Tipo de transferencia">
    <div>contenido real del paso 1...</div>
    <div slot="summary">resumen del paso 1 ya completado</div>
  </ac-expandable-step>
  <ac-expandable-step header="Datos del destinatario">
    <div>contenido real del paso 2...</div>
    <div slot="summary">resumen del paso 2 ya completado</div>
  </ac-expandable-step>
  <div slot="confirmation">
    <p>Transferencia realizada con éxito.</p>
  </div>
</ac-expandable-multistep>
```

Los `<ac-expandable-step>` van como hijos directos del slot default (no envueltos en un `<div>` intermedio). El `<div slot="confirmation">` se muestra recién cuando **todos** los steps están completados.

## Propiedades

| Propiedad   | Atributo    | Tipo    | Default | Descripción                                                                                                                                                                                                          |
| ----------- | ----------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `completed` | `completed` | Boolean | `false` | `true` cuando TODOS los `ac-expandable-step` hijos están completados (revela el slot `confirmation`). Vuelve a `false` si se edita un step anterior después de haber llegado a este estado. Reflejado como atributo. |

Sin properties de configuración adicionales: el estado vive 100% en los `ac-expandable-step` hijos, el multistep solo coordina.

## Coordinación con los hijos

En cada `slotchange` del slot default:

1. Toma los `ac-expandable-step` asignados (`slot.assignedElements({ flatten: true })`, filtrando por `localName === 'ac-expandable-step'`), en orden.
2. Re-numera siempre, de forma idempotente (por si se agregan/quitan steps dinámicamente): asigna `stepNumber`/`totalSteps` a cada step como **properties directas**.
3. **Solo la primera vez** que hay steps asignados: si ningún step precargó ya `active`/`completed` en `true`, activa el primero (`steps[0].active = true`). Si el consumidor precargó estado (para retomar un flujo a medio completar), no lo pisa.

## Slots

| Slot           | Descripción                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| _(default)_    | Los `ac-expandable-step` del flujo, como hijos directos.                      |
| `confirmation` | Contenido de confirmación final, visible recién cuando `completed` es `true`. |

## Eventos

Todos `bubbles` y `composed`. El `detail` es siempre un objeto plano serializable (nunca una referencia a un elemento del DOM).

| Evento                                       | Cuándo                                                                                                                                                     | `detail`                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `ac-expandable-multistep-active-step-change` | Cambia el step activo: al completar uno intermedio (avanza al siguiente), al editar uno (vuelve a él) y en la **auto-activación inicial** del primer step. | `{ stepNumber, totalSteps }` del step ahora activo |
| `ac-expandable-multistep-all-complete`       | Se completa el último step de la secuencia.                                                                                                                | `{}`                                               |

### Nota: `-active-step-change` es una excepción deliberada al patrón `-toggle`

A diferencia de eventos como el `-toggle` de `ac-expandable-basic` (que NO se emiten en la primera renderización, porque el estado inicial no es un "cambio"), `ac-expandable-multistep-active-step-change` **sí** se emite también cuando el `slotchange` activa automáticamente el primer step por primera vez. El propósito de este evento es puramente informativo — "cuál step está activo ahora mismo", útil para que el consumidor haga scroll-into-view o resalte una navegación externa — no es una señal de "algo cambió por acción del usuario" como sí lo es `-toggle`. Por eso se emite siempre que el step activo cambia, sin importar la causa.

## Comportamiento al completar y editar

- **Completar un step** (`ac-expandable-step-complete`, burbujeando desde el step): se busca su índice por posición en el array de steps (no se exige que sea el step `active`, diseño simple sin forzar un wizard estricto).
  - Si no es el último: activa el siguiente (`active = true`) y emite `-active-step-change`.
  - Si es el último: pone `completed = true` en el host y emite `-all-complete`.
- **Editar un step** (`ac-expandable-step-edit`, burbujeando desde el step): llama a `step.edit()` (lo reactiva), resetea a pendiente (`completed = false; active = false`) todos los steps **posteriores**, vuelve `completed = false` en el host si ya estaba en `true`, y emite `-active-step-change` con el step editado.

## Accesibilidad

- Validado con axe-core en ambos temas (claro y oscuro).
- Este componente no introduce texto propio ni controles interactivos adicionales — la accesibilidad de cada paso (foco, roles, contraste) la resuelve `ac-expandable-step`.

## i18n

`locales.json` no tiene claves propias — no hay texto propio que traducir, todo el texto vive en los `ac-expandable-step` hijos o en el contenido del consumidor.

## Desarrollo

```bash
ac component:serve           # o: pnpm --filter @ac-components/ac-expandable-multistep component:serve    — demo en http://localhost:5173
ac component:test
ac component:build
ac component:test:e2e        # funcional (WebdriverIO + Cucumber)
ac component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `src/expandable-multistep.styles.js` se genera a partir de `src/expandable-multistep.styles.scss` (`component:build:styles`, corre automáticamente antes de `component:serve`/`component:build`/`component:test`) y no se versiona en git. Durante `component:serve` queda además en modo watch: cada guardado de `.scss` lo recompila y Vite recarga el navegador solo, sin reiniciar nada.
