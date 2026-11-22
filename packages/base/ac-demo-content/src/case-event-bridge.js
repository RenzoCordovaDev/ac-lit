// Puente padre↔iframe para un caso de demo cargado en un <iframe> (ver
// demo-case.js: camino "documento completo"). Lo importa el <script> del
// propio caso (junto al resto de imports que ya registra sus componentes).
// Un iframe es su propio realm de JS: ninguna variable ni estado de módulo
// del documento padre llega adentro por su cuenta, con lo cual necesita este
// puente para 2 cosas:
//
// 1. Reenviar al padre los eventos que `ac-demo-content` necesita loguear en
//    su panel de eventos (`events="..."`) — un CustomEvent con
//    `composed: true` atraviesa shadow DOM pero NUNCA el límite de un
//    iframe. `ac-demo-content`, al detectar el iframe (`_onCaseLoad` en
//    demo-content.js), le hace un postMessage con los nombres de evento que
//    le interesan; desde ahí este puente escucha exactamente esos nombres en
//    el documento del iframe y reenvía cada uno, también por postMessage.
// 2. Replicar el idioma global hacia ESTE realm: `setGlobalLocale()` (de
//    `@ac-base/ac-intl-mixin`) solo cambia la variable de módulo de quien la
//    llama — el documento padre tiene su propia copia del módulo, separada
//    de la del iframe, así que cambiar el idioma en el padre no traduce nada
//    acá adentro sin este puente.
import { setGlobalLocale } from '@ac-base/ac-intl-mixin';

if (window.parent !== window) {
  window.addEventListener('message', initEvent => {
    if (!initEvent.data) return;
    if (initEvent.data.__acDemoBridgeInit === true) {
      const eventNames = Array.isArray(initEvent.data.eventNames) ? initEvent.data.eventNames : [];
      for (const name of eventNames) {
        document.addEventListener(name, event => {
          window.parent.postMessage(
            { __acDemoBridgeEvent: true, name: event.type, detail: event.detail },
            '*',
          );
        });
      }
    } else if (initEvent.data.__acDemoBridgeSetLocale === true) {
      setGlobalLocale(initEvent.data.locale);
    }
  });
}
