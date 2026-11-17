# @ac-base/ac-demo-content

## 0.2.0

### Minor Changes

- 09bf578: `ac-demo-content` suma un modo embebido y una API pública para manejarlo desde afuera: con la propiedad/atributo `embedded` deja de dibujar su cabecera y su toolbar (queda solo el escenario y el panel de eventos), pensado para incrustar la demo en otra página que dibuja sus propios controles — como el catálogo visual, que carga cada demo en un `<iframe>`.

  - Métodos nuevos: `selectCase(index)`, `selectLanguage(index)`, `selectAmbient(value)`, `selectTheme(theme)`, `selectDevice(key)`, `selectViewMode(mode)`, `openEventsPanel()` y `closeEventsPanel()`. Los valores inválidos se ignoran. Los controles propios del toolbar pasan a usar estos mismos métodos.
  - Getter nuevo `demoState`: casos, idiomas, ambients, tema, dispositivo, vista y cantidad de eventos registrados.
  - Evento nuevo `ac-demo-content-state-change` (`bubbles`, `composed`), con `demoState` como `detail`, cada vez que cambia ese estado.

  Sin `embedded` la demo se ve y se comporta igual que antes.

## 0.1.1

### Patch Changes

- fe3991b: El binario del CLI se renombra de `ac` a `aclit`: en PowerShell, `ac` es un alias nativo de `Add-Content`, que resuelve antes que cualquier ejecutable del PATH — `ac component:create ...` nunca llegaba a este CLI en Windows (PowerShell intentaba correr `Add-Content` y tiraba `DriveNotFoundException`). Quien tenga `@ac-base/cli` instalado globalmente necesita reinstalarlo para que aparezca el nuevo binario `aclit`; no queda un alias de compatibilidad para `ac`.

  Además, todo paquete de componente (catálogo y el template de scaffolding del CLI) suma un script real `component:lint` (`eslint .`, acotado al paquete) — cierra el hueco donde `lint` era el único script que no seguía la convención `component:<verbo>`.
