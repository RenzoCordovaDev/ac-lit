@e2e
Feature: ac-toast-basic - notificaciones temporales

  Como desarrollador del catálogo ac-lit
  Quiero que ac-toast-basic se muestre, se cierre solo y dispare sus eventos
  Para asegurar posiciones, apilado, acción y cierre manual

  Background:
    Given el usuario está en el demo de "ac-toast-basic"

  @smoke
  Scenario: El botón muestra el toast con su mensaje
    When el usuario pulsa el botón "show-success"
    Then el toast "toast-success" está visible
    And el toast "toast-success" muestra el texto "Cambios guardados"

  Scenario: El toast aparece abajo por defecto
    When el usuario pulsa el botón "show-neutral"
    Then el toast "toast-neutral" aparece abajo de la pantalla

  Scenario: El toast se oculta solo pasada su duración
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-short"
    Then el toast "toast-short" está visible
    And el toast "toast-short" se oculta solo

  Scenario: El cierre automático dispara el evento con motivo timeout
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-short"
    Then el evento "ac-toast-basic-close" con motivo "timeout" se registra en el log

  Scenario: Un toast con duration 0 no se cierra solo
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-action"
    Then el toast "toast-action" sigue visible tras 2 segundos

  Scenario: El botón de cerrar oculta el toast y dispara sus eventos
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-action"
    And el usuario cierra el toast "toast-action" con su botón de cerrar
    Then el toast "toast-action" está oculto
    And el evento "ac-toast-basic-close-click" se registra en el log
    And el evento "ac-toast-basic-close" con motivo "close-button" se registra en el log

  Scenario: La acción del toast dispara su evento sin cerrarlo
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-action"
    And el usuario pulsa la acción del toast "toast-action"
    Then el evento "ac-toast-basic-action-click" se registra en el log
    And el toast "toast-action" está visible

  Scenario: La acción se traduce al cambiar de idioma
    When el usuario selecciona el caso "1"
    And el usuario selecciona el idioma "1"
    And el usuario pulsa el botón "show-action"
    Then el toast "toast-action" muestra el texto "Undo"

  Scenario: El toast con position top aparece arriba
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-top"
    Then el toast "toast-top" aparece arriba de la pantalla

  Scenario: Dos toasts en la misma posición se apilan sin taparse
    When el usuario selecciona el caso "1"
    And el usuario pulsa el botón "show-stack"
    Then el toast "toast-stack-1" está visible
    And el toast "toast-stack-2" está visible
    And el toast "toast-stack-1" no se superpone con el toast "toast-stack-2"
