# @ac-components/ac-input-basic

## 0.2.0

### Minor Changes

- a90f84e: `ac-icon-basic` suma 4 íconos nuevos (`email`, `calendar`, `currency`, `hash`). `ac-input-basic` suma una capa semántica sobre `type` (`amount`, `date`, `number`, `email`) que muestra un ícono a la izquierda y un placeholder sugerido por tipo, sin cambiar el `type` nativo del `<input>` ni el comportamiento existente de `password`/`search`/`tel`/`url`.

### Patch Changes

- Updated dependencies [a90f84e]
  - @ac-components/ac-icon-basic@0.2.0

## 0.1.1

### Patch Changes

- fe3991b: El binario del CLI se renombra de `ac` a `aclit`: en PowerShell, `ac` es un alias nativo de `Add-Content`, que resuelve antes que cualquier ejecutable del PATH — `ac component:create ...` nunca llegaba a este CLI en Windows (PowerShell intentaba correr `Add-Content` y tiraba `DriveNotFoundException`). Quien tenga `@ac-base/cli` instalado globalmente necesita reinstalarlo para que aparezca el nuevo binario `aclit`; no queda un alias de compatibilidad para `ac`.

  Además, todo paquete de componente (catálogo y el template de scaffolding del CLI) suma un script real `component:lint` (`eslint .`, acotado al paquete) — cierra el hueco donde `lint` era el único script que no seguía la convención `component:<verbo>`.
