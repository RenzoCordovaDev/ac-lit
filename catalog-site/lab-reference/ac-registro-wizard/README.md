# `ac-registro-wizard`

Componente de referencia del **Capítulo 1 (Construcción) del Laboratorio de
aprendizaje** de `ac-lit` (`catalog-site/#laboratorio`). Es un wizard de
registro de usuario de 3 pasos (datos personales, preferencias, resumen),
construido con el mismo `aclit component:create` que generaría cualquier
componente real del catálogo — pero vive fuera de `packages/components/`,
nunca se publica (`"private": true`, sin `publishConfig`) y existe solo para
validar que los 10 laboratorios del capítulo son precisos y ejecutables.

## Instalación

Este paquete no se publica — se consume solo dentro del monorepo, vía
`workspace:^`, desde `catalog-site/learning-lab.js` (link "Ver solución") y
desde su propia demo.

```js
import '@ac-components/ac-registro-wizard';
```

```html
<ac-registro-wizard></ac-registro-wizard>
```

## Métodos públicos

| Método    | Qué hace                                                                                  |
| --------- | ----------------------------------------------------------------------------------------- |
| `init()`  | Simula una lectura inicial contra `ac-api-users` para precargar el saludo de bienvenida.  |
| `reset()` | Vuelve el wizard al estado inicial: paso 1, sin datos, transición abierta, modal cerrado. |

## Eventos

| Evento                                | `detail`               | Cuándo se dispara                                         |
| ------------------------------------- | ---------------------- | --------------------------------------------------------- |
| `ac-registro-wizard-step-change`      | `{ step, totalSteps }` | Al cambiar el paso activo del multistep.                  |
| `ac-registro-wizard-register-success` | `{ data }`             | Al confirmar el registro con éxito contra `ac-api-users`. |
| `ac-registro-wizard-register-error`   | `{ error }`            | Al fallar el guardado contra `ac-api-users`.              |
| `ac-registro-wizard-reset`            | —                      | Al llamar a `reset()` (manual, o tras cerrar el modal).   |

## Modal de éxito (pantalla completa) y modal de información

El modal de éxito (`registro-wizard-modal-resultado`) usa `size="full"`:
cubre toda la pantalla, como una página propia de confirmación, no un
diálogo flotante. La cabecera del `ac-transition-container` tiene además un
botón-ícono (`ac-icon-button-basic`, ícono `info`, slot `header-end`) que
abre un segundo modal, independiente del de éxito, con tamaño normal
(`offset`, el default) y la información general del laboratorio.

## Estructura interna

El `render()` del componente principal solo declara `ac-api-users`,
`ac-transition-container` y `ac-modal-basic` (×2: éxito e información)
directamente — el resto del wizard vive partido en custom elements propios,
bajo `src/elements/`, cada uno con su `.scss` independiente:

- `registro-wizard-steps` — coordina `ac-expandable-multistep` y sus 3
  `ac-expandable-step`, y valida el paso 1 antes de avanzar.
- `registro-wizard-step-datos` / `-step-preferencias` / `-step-resumen` —
  el contenido real de cada uno de los 3 pasos.
- `registro-wizard-modal-resultado` — el contenido del modal de éxito
  (pantalla completa).
- `registro-wizard-modal-info` — el contenido estático del modal de
  información general del laboratorio.

Ninguno de estos 5 elementos lleva el prefijo `ac-`: son piezas internas de
este componente, no parte del catálogo público, aunque sí extienden
`ComponentMixin(LitElement)` igual que cualquier componente real. Las
constantes y valores fijos del wizard (opciones de rol, valores de plan,
versión simulada de la API) viven centralizados en `src/utils/constants.js`.

## i18n

`locales.json` (`es-PE`/`en-EN`/`pt-BR`) tiene las claves `registro-wizard-*`
que usan el componente principal y sus 5 elementos de contenido — todos
comparten el mismo archivo (`index.js` registra las traducciones para los 7
tags).

## Desarrollo

```bash
aclit component:serve           # o: pnpm --filter @ac-components/ac-registro-wizard component:serve    — demo en http://localhost:5173
aclit component:lint
aclit component:test
aclit component:build
aclit component:test:e2e        # funcional (WebdriverIO + Cucumber)
aclit component:test:e2e:a11y   # accesibilidad (axe-core)
```

> `component:build:styles` compila los 7 `.scss` del componente (el
> principal + los 6 de `src/elements/`) a sus `*.styles.js` — gitignorados,
> no se versionan. Durante `component:serve` quedan además en modo watch (7
> watchers en paralelo vía `concurrently`): cada guardado de cualquier
> `.scss` recompila su propio archivo y Vite recarga el navegador solo, sin
> reiniciar nada.
