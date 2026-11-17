---
'@ac-base/ac-demo-content': minor
---

`ac-demo-content` suma un modo embebido y una API pública para manejarlo desde afuera: con la propiedad/atributo `embedded` deja de dibujar su cabecera y su toolbar (queda solo el escenario y el panel de eventos), pensado para incrustar la demo en otra página que dibuja sus propios controles — como el catálogo visual, que carga cada demo en un `<iframe>`.

- Métodos nuevos: `selectCase(index)`, `selectLanguage(index)`, `selectAmbient(value)`, `selectTheme(theme)`, `selectDevice(key)`, `selectViewMode(mode)`, `openEventsPanel()` y `closeEventsPanel()`. Los valores inválidos se ignoran. Los controles propios del toolbar pasan a usar estos mismos métodos.
- Getter nuevo `demoState`: casos, idiomas, ambients, tema, dispositivo, vista y cantidad de eventos registrados.
- Evento nuevo `ac-demo-content-state-change` (`bubbles`, `composed`), con `demoState` como `detail`, cada vez que cambia ese estado.

Sin `embedded` la demo se ve y se comporta igual que antes.
