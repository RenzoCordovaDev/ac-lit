@e2e
Feature: ac-expandable-basic - panel expandible

  Como desarrollador del catálogo ac-lit
  Quiero que ac-expandable-basic abra y cierre su contenido
  Para asegurar el toggle, el acordeón por grupo, el bloqueo y la traducción

  Background:
    Given el usuario está en el demo de "ac-expandable-basic"

  @smoke
  Scenario: Hacer click en una cabecera cerrada abre el panel y dispara el evento
    When el usuario hace click en la cabecera de "expandable-custom"
    Then el evento "ac-expandable-basic-toggle" con open "true" se registra en el log

  Scenario: Un panel abierto muestra su contenido
    Then el contenido del panel "expandable-details" es visible

  Scenario: Cerrar un panel oculta su contenido
    When el usuario hace click en la cabecera de "expandable-details"
    Then el contenido del panel "expandable-details" está oculto

  Scenario: Abrir un panel cerrado muestra su contenido
    When el usuario hace click en la cabecera de "expandable-custom"
    Then el contenido del panel "expandable-custom" es visible

  Scenario: En un grupo, abrir un panel cierra el que estaba abierto
    When el usuario selecciona el caso "1"
    And el usuario hace click en la cabecera de "expandable-faq-2"
    Then el panel "expandable-faq-1" tiene open igual a "false"

  Scenario: En un grupo, el panel pulsado queda abierto
    When el usuario selecciona el caso "1"
    And el usuario hace click en la cabecera de "expandable-faq-2"
    Then el panel "expandable-faq-2" tiene open igual a "true"

  Scenario: Los paneles sin grupo pueden estar abiertos a la vez
    When el usuario selecciona el caso "1"
    And el usuario hace click en la cabecera de "expandable-free-1"
    Then el panel "expandable-free-2" tiene open igual a "true"

  Scenario: Un panel deshabilitado no se abre
    When el usuario selecciona el caso "1"
    And el usuario hace click en la cabecera de "expandable-disabled"
    Then el evento "ac-expandable-basic-toggle" no se registra en el log

  Scenario: Cambiar el idioma traduce la cabecera
    When el usuario selecciona el caso "0"
    And el usuario selecciona el idioma "1"
    Then la cabecera del panel "expandable-i18n" muestra "More details"
