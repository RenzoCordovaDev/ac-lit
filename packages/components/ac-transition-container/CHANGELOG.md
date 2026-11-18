# @ac-components/ac-transition-container

## 1.0.0

### Major Changes

- f24ce3a: Se renombra la propiedad pública `visible` a `open` para homologar el nombre con `ac-modal-basic` — breaking change, quien use `visible`/`?visible` debe migrar a `open`/`?open`.

## 0.1.2

### Patch Changes

- 044712d: Retroqueo a Emerald Pro de los tres componentes que quedaron fuera del retrofit original (se desarrollaron en paralelo o después): `ac-transition-container`, `ac-expandable-step` y `ac-expandable-multistep`. Reemplaza radios, tipografía y espaciados hardcodeados por los tokens del sistema (`--radius-*`, `--font-size-*`/`--font-weight-*`, `--space-*`) y suma `componentBaseStyles` a los tres (ninguno fijaba `--font-family` en `:host` hasta ahora). Sin cambios de identidad visual, paleta de color ni API pública — solo CSS/tokens.

## 0.1.1

### Patch Changes

- fe3991b: El binario del CLI se renombra de `ac` a `aclit`: en PowerShell, `ac` es un alias nativo de `Add-Content`, que resuelve antes que cualquier ejecutable del PATH — `ac component:create ...` nunca llegaba a este CLI en Windows (PowerShell intentaba correr `Add-Content` y tiraba `DriveNotFoundException`). Quien tenga `@ac-base/cli` instalado globalmente necesita reinstalarlo para que aparezca el nuevo binario `aclit`; no queda un alias de compatibilidad para `ac`.

  Además, todo paquete de componente (catálogo y el template de scaffolding del CLI) suma un script real `component:lint` (`eslint .`, acotado al paquete) — cierra el hueco donde `lint` era el único script que no seguía la convención `component:<verbo>`.
