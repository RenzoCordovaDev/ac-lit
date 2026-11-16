---
'@ac-components/ac-transition-container': patch
'@ac-components/ac-expandable-step': patch
'@ac-components/ac-expandable-multistep': patch
---

Retroqueo a Emerald Pro de los tres componentes que quedaron fuera del retrofit original (se desarrollaron en paralelo o después): `ac-transition-container`, `ac-expandable-step` y `ac-expandable-multistep`. Reemplaza radios, tipografía y espaciados hardcodeados por los tokens del sistema (`--radius-*`, `--font-size-*`/`--font-weight-*`, `--space-*`) y suma `componentBaseStyles` a los tres (ninguno fijaba `--font-family` en `:host` hasta ahora). Sin cambios de identidad visual, paleta de color ni API pública — solo CSS/tokens.
