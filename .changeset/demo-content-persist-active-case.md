---
'@ac-base/ac-demo-content': minor
---

`ac-demo-content` ahora persiste el caso activo en `localStorage` (por `name`, `ac-lit:demo-active-case:<name>`): guardar un cambio con `component:serve` corriendo (HMR) o recargar la página a mano mantiene el caso que tenías elegido, en vez de volver siempre al primero. Solo vuelve al primer caso si todavía no hay nada guardado para ese componente (primera vez que se visita esa demo) o al elegir un caso a mano desde el selector.
