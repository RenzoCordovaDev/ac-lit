# @ac-components/ac-button-basic

## 0.1.2

### Patch Changes

- 58c5096: Revisión profunda del retrofit a Emerald Pro de los 4 primeros componentes del catálogo (`ac-button-basic`, `ac-link-basic`, `ac-badge-basic`, `ac-radio-basic`), comparados contra componentes nativos de Emerald Pro (`ac-card-basic`, `ac-spinner-basic`, `ac-avatar-basic`, `ac-notification-basic`). `ac-link-basic` ya estaba alineado, sin cambios.

  - `ac-button-basic`/`ac-badge-basic`: corrige fallbacks de `var(--space-*, ...)` y `var(--radius-full, ...)` que no coincidían con el valor real del token (ej. `var(--space-2, 0.6rem)` cuando `--space-2` vale `0.5rem`, `var(--radius-full, 999px)` en vez de `9999px`) — sin efecto visible mientras `base.css` esté importado, pero rompían el fallback documentado para cuando no lo está.
  - `ac-radio-basic`: reemplaza el `border-radius: 50%` hardcodeado del control y del punto marcado por `var(--radius-full, 9999px)` (igual que `ac-switch-basic`/`ac-checkbox-basic`/`ac-avatar-basic`/`ac-spinner-basic`); ajusta el punto interno de `0.6rem` (fuera de la grilla de 4px) a `0.5rem`; y corrige un bug real de contraste — el borde/punto del estado marcado usaba `--color-primary-500` fijo (pensado para fondo oscuro) sin redefinir en tema claro, cayendo a ~2.4:1 contra la página (no cumple el 3:1 no-textual de WCAG 1.4.11). Se agrega la redefinición por tema (mismo patrón que `ac-spinner-basic`/`ac-link-basic`) y se cambia el anillo de foco de un verde traslúcido casi invisible en claro a un `outline` sólido con token, igual que `ac-checkbox-basic`/`ac-switch-basic`.

  Sin cambios de identidad visual, paleta de color ni API pública — solo CSS/tokens.

## 0.1.1

### Patch Changes

- fe3991b: El binario del CLI se renombra de `ac` a `aclit`: en PowerShell, `ac` es un alias nativo de `Add-Content`, que resuelve antes que cualquier ejecutable del PATH — `ac component:create ...` nunca llegaba a este CLI en Windows (PowerShell intentaba correr `Add-Content` y tiraba `DriveNotFoundException`). Quien tenga `@ac-base/cli` instalado globalmente necesita reinstalarlo para que aparezca el nuevo binario `aclit`; no queda un alias de compatibilidad para `ac`.

  Además, todo paquete de componente (catálogo y el template de scaffolding del CLI) suma un script real `component:lint` (`eslint .`, acotado al paquete) — cierra el hueco donde `lint` era el único script que no seguía la convención `component:<verbo>`.
